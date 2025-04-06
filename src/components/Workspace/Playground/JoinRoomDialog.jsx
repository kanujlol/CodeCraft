import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function JoinRoomDialog({ open, onClose, onJoin }) {
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Join Room</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter ID for room to join:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="roomId"
          label="Room ID"
          type="text"
          fullWidth
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleJoin} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JoinRoomDialog;