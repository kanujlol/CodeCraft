import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { firestore, servers } from './firebaseConfig';
import JoinRoomDialog from './JoinRoomDialog';
import VideoStream from './VideoStream';

// Using styled API instead of makeStyles
const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const VideosContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}));

const VideoWrapper = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
}));

const CurrentRoom = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

function VideoRoom() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // Enable/disable buttons based on state
  const cameraEnabled = localStream !== null;
  const roomConnected = roomId !== null;

  // Clean up function to handle hangup
  const cleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }

    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    
    // Delete room on hangup
    if (roomId) {
      const roomRef = firestore.collection('rooms').doc(roomId);
      localStorage.removeItem('videoId');
      window.location.reload();
      // Delete all candidates
      const calleeCandidates = await roomRef.collection('calleeCandidates').get();
      calleeCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      
      const callerCandidates = await roomRef.collection('callerCandidates').get();
      callerCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      
      // Delete the room
      await roomRef.delete();
      setRoomId(null);
    }
    if(localStorage.getItem('videoId')==100){
        localStorage.removeItem('videoId');
        window.location.reload();
    }
  };

  // Set up listeners for peer connection
  const registerPeerConnectionListeners = (pc) => {
    pc.addEventListener('icegatheringstatechange', () => {
      console.log(`ICE gathering state changed: ${pc.iceGatheringState}`);
    });

    pc.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${pc.connectionState}`);
    });

    pc.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${pc.signalingState}`);
    });

    pc.addEventListener('iceconnectionstatechange', () => {
      console.log(`ICE connection state change: ${pc.iceConnectionState}`);
    });
  };

  // Open camera and microphone
  const openUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      setRemoteStream(new MediaStream());
    } catch (error) {
      console.error('Error opening media devices:', error);
    }
  };

  // Create a new room
  const createRoom = async () => {
    try {
      // Create a new peer connection
      const pc = new RTCPeerConnection(servers);
      setPeerConnection(pc);
      registerPeerConnectionListeners(pc);

      // Add local tracks to the peer connection
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Create a new room in Firestore
      const roomRef = await firestore.collection('rooms').doc();
      
      // Set up ICE candidate collection
      const callerCandidatesCollection = roomRef.collection('callerCandidates');
      pc.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate:', event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
      });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      
      await roomRef.set(roomWithOffer);
      setRoomId(roomRef.id);
      setIsCreator(true);
      
      // Listen for remote tracks
      pc.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
        });
      });

      // Listen for remote session description
      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data && data.answer) {
          console.log('Got remote description:', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await pc.setRemoteDescription(rtcSessionDescription);
        }
      });

      // Listen for remote ICE candidates
      roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // Join an existing room
  const joinRoom = async (roomIdToJoin) => {
    try {
      setDialogOpen(false);
      
      const roomRef = firestore.collection('rooms').doc(roomIdToJoin);
      const roomSnapshot = await roomRef.get();
      
      if (!roomSnapshot.exists) {
        console.log('Room does not exist!');
        return;
      }
      
      // Create a new peer connection
      const pc = new RTCPeerConnection(servers);
      setPeerConnection(pc);
      registerPeerConnectionListeners(pc);
      
      // Add local tracks to the peer connection
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
      
      // Set up ICE candidate collection
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      pc.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate:', event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });
      
      // Listen for remote tracks
      pc.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
        });
      });
      
      // Get remote description (offer)
      const offer = roomSnapshot.data().offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      
      await roomRef.update(roomWithAnswer);
      
      // Listen for remote ICE candidates
      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
      
      setRoomId(roomIdToJoin);
      setIsCreator(false);
      
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <Root>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<VideocamIcon />}
            onClick={openUserMedia}
            disabled={cameraEnabled}
          >
            Open camera & microphone
          </StyledButton>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<GroupAddIcon />}
            onClick={createRoom}
            disabled={!cameraEnabled || roomConnected}
          >
            Create room
          </StyledButton>
          
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<GroupIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={!cameraEnabled || roomConnected}
          >
            Join room
          </StyledButton>
          
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={cleanUp}
            disabled={!cameraEnabled}
          >
            Hangup
          </StyledButton>
        </Grid>
        
        {roomId && (
  <Grid item xs={12}>
    <CurrentRoom>
      <Typography variant="subtitle1" className="text-white">
        Current room is <strong>{roomId}</strong> — You are the <strong>{isCreator ? 'caller' : 'callee'}</strong>!
        Share this ID with your friends to join the room.
      </Typography>

      {/* Copy Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          navigator.clipboard.writeText(roomId);
          alert("Room ID copied to clipboard!");
        }}
        style={{ marginTop: '10px', color: 'white', borderColor: 'white' }}
      >
        Copy Room ID
      </Button>
    </CurrentRoom>
  </Grid>
)}

        <Grid item xs={12} component={VideosContainer}>
          <VideoWrapper>
            <VideoStream
              stream={remoteStream}
              muted={false}
              mirrored={false}
            />
          </VideoWrapper>
          
          <VideoWrapper>
            <VideoStream
              stream={localStream}
              muted={true}
              mirrored={true}
            />
          </VideoWrapper>
        </Grid>
      </Grid>
      
      <JoinRoomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onJoin={joinRoom}
      />
    </Root>
  );
}

export default VideoRoom;