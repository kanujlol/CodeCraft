import React, {useState,useEffect, useRef} from "react";
import Hero from "../Hero";
import msgIcon from './message.svg'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Topbar from "../Topbar/Topbar";
import ReactMarkdown from "react-markdown"
import styles1 from './right.module.css'
import Del from './delete.svg'
import { toast } from "react-toastify";
import { supabase } from '../../supabase/supabase'
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../../styles";
//import { experiences } from "../constants";
//import { SectionWrapper } from "../../hoc";
import { textVariant } from "../../utils/motion";
//import styles from './right.module.css';
const App =() => {
    const [topic, setTopic] = useState("");
    const [result, setResult] = useState(null);
    const [linkclub,setLinkClub] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [utopics, setUTopics] = useState(null);
    const [videolink,setVideoLink]=useState(""); 
    const resultRef = useRef(null);
    const [userDetails, setUserDetails] = useState({
      profession: "",
      age: 0,
      experience: 0,
      level: "",
    });
  const [allTopics, setAllTopics] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  useEffect(() => {
    // Fetch all topics from the "topics" table
    const fetchAllTopics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Handle case where user is not logged in
          return;
        }
        
        const { data: topicsData } = await supabase
          .from('topics')
          .select('topics')
          .eq('email', user.email);
  
        if (topicsData.length) {
          // Extract topic names and update state
          const topics = Object.keys(topicsData[0].topics);
          setAllTopics(topics);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    
    fetchAllTopics();
  }, []); // Run the effect only once on mount
  
  
  useEffect(() => {

    if (!isLoading && result) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [isLoading, result]);
  
  const handleTopicButtonClick = async (selectedTopic) => {
    // Update the state
    setTopic(selectedTopic);
    handleSubmit(selectedTopic);
  };
  
  const extractDomain = (url) => {
      const hostname = new URL(url).hostname;
      return hostname
        //.replace(/^www\./, ''); // Remove 'www.' if present
    };
    
      const LoadingSkeleton = () => {
        return (
          <div className="flex items-center space-x-12 mt-4 px-6">
            <div className="w-6 h-6 rounded-full bg-dark-layer-1 animate-pulse"></div>
            <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1 animate-pulse"></div>
            <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1 animate-pulse"></div>
            <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1 animate-pulse"></div>
          </div>
        );
      };
      const ExperienceCard = ({ link, isLoading }) => {
        return (
          
          <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{
            background: "transparent",  
            display: "none", // Hide the icon
          }}
          contentStyle={{
            background: "#1d1836",
            color: "#fff",
            padding: "0", // Adjust padding
          }}
          contentArrowStyle={{ borderRight: "7px solid  linear-gradient(-90deg, #F28C28 0%, rgba(60, 51, 80, 0) 100%) #232631" }}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
              <div>
                <h3 className='text-white text-[24px] font-bold'>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="" // Centered and limited width
                  >
                    {extractDomain(link)}
                  </a>
                </h3>
              </div>
            )}
          </VerticalTimelineElement>
        );
      };
      

      
      /*const VideoCard = ({ video }) => {
        const isVideo = video.id.kind === "youtube#video";
        const videoId = isVideo ? video.id.videoId : null;
        const playlistId = isVideo ? null : video.id.playlistId;
        return (
          <VerticalTimelineElement
            contentStyle={{
              background: "#1d1836",
              color: "#fff",
            }}
            contentArrowStyle={{ borderRight: "7px solid  #232631" }}
          >
            <div>
              {isVideo ? (
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-auto"
                />
              )}
              <h3 className="text-white text-[24px] font-bold">
                <a
                  href={`https://www.youtube.com/${isVideo ? 'watch?v=' + videoId : 'playlist?list=' + playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.snippet.title}
                </a>
              </h3>
            </div>
          </VerticalTimelineElement>
        );
      };*/
      
      
      const VideoCard = ({ video, isLoading }) => {
        const isVideo = video.id.kind === "youtube#video";
        const videoId = isVideo ? video.id.videoId : null;
        const playlistId = isVideo ? null : video.id.playlistId;
      
        return (
          <VerticalTimelineElement
            contentStyle={{
              background: "#1d1836",
              color: "#fff",
            }}
            contentArrowStyle={{ borderRight: "7px solid #232631",backgroundImage: "linear-gradient(to bottom, #FFA500, #FF6347)", }}
          >
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div>
                {isVideo ? (
                  <iframe
                    width="100%"
                    height="285"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={video.snippet.title}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-auto"
                  />
                )}
                <h3 className="text-white text-[24px] font-bold">
                  <a
                    href={`https://www.youtube.com/${isVideo ? 'watch?v=' + videoId : 'playlist?list=' + playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.snippet.title}
                  </a>
                </h3>
              </div>
            )}
          </VerticalTimelineElement>
        );
      };
      
      const getUserTopics = async (email) => {
        try {
          // Get the existing user topics from the "topics" table
          const { data: existingTopics } = await supabase
            .from('topics')
            .select('topics')
            .eq('email', email);
      
          // If topics exist for the user, print each topic and its status
          if (existingTopics.length) {
            const userTopics = existingTopics[0].topics;
            //setUTopics(userTopics)
            console.log('User Topics:');
            console.log("added",userTopics)
           
            for (const topic in userTopics) {
              const status = userTopics[topic] === 0 ? 'Not Assigned' : 'Assigned';
              console.log(`${topic}: ${status}`);
            }
          } else {
            console.log('No topics found for the user.');
          }
        } catch (error) {
          console.error('Error getting user topics:', error);
        }
      };

      
      const storeUserTopics = async (email, topic) => {
        try {
          // Get the existing user topics from the "topics" table
          console.log("check meial",email)
          const { data: existingTopics } = await supabase
            .from('topics')
            .select('topics')
            .eq('email', email);
      
          // Parse the existing topics JSON string or initialize an empty object
          const userTopics = existingTopics.length ? (existingTopics[0].topics) : {};
      
          // Update the user's topic status (1 means selected in this case)
          userTopics[topic] = 0;
      
          // Update the "topics" table with the new topics JSON string
          await supabase
            .from('topics')
            .upsert([
              {
                email: email,
                topics: (userTopics),
              },
            ]);
      
          console.log('User topics updated successfully:', userTopics);
          
        } catch (error) {
          console.error('Error updating user topics:', error);
        }
      };

      const handleDelete = async (topicToDelete) => {
        console.log("to dlete",topicToDelete)
        const { data: {user} } = await supabase.auth.getUser();
        console.log()
      
        if (!user) {
          // Handle user not logged in
          return;
        }
      
        try {
          // Fetch the existing user topics from the "topics" table
          console.log("deletion",user.email)
          const { data: existingmainTopics } = await supabase
            .from('topics')  // Replace with your actual table name
            .select('topics')
            .eq('email', user.email);

          console.log("topics existing",existingmainTopics)
      
          if (existingmainTopics.length) {
            // Get the current user topics
            const userTopics = existingmainTopics[0].topics;
            console.log("to delete topic :",userTopics)
      
            // Delete the specified topic
            delete userTopics[topicToDelete];

            console.log(userTopics,"after")
            setAllTopics((prevTopics) => prevTopics.filter((topic) => topic !== topicToDelete));
      
            // Update the "topics" table with the new topics JSON string
            await supabase
              .from('topics')  // Replace with your actual table name
              .upsert([
                {
                  email: user.email,
                  topics: (userTopics),
                },
              ])
              .eq('email',user.email);
      
            console.log(`Topic "${topicToDelete}" deleted successfully`);
          } else {
            console.log('No topics found for the user.');
          }
        } catch (error) {
          console.error('Error deleting user topic:', error);
        }
      };

    const handleSubmit = async (maintopic) => {
      setTopic(maintopic)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to submit", { position: "top-center", autoClose: 3000, theme: "dark" });
        return;
      }

      try {
        setIsLoading(true);
        setIsLoadingButton(true);
        const responselinks = await fetch('http://localhost:8081/api', {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },

          body: JSON.stringify({ topic }),

        });
  
        const linkset = await responselinks.json();
        console.log(linkset.result)
        setLinkClub(linkset.result);

        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          

        console.log(data)

        setUserDetails({
          profession: data[0].profession,
          age: data[0].ageGroup,
          experience: data[0].experience,
          level: data[0].level,
        });
    
        console.log("DETAILS:", userDetails);
    
        const apiRequestBody = {
          "topic": maintopic,
          "profession": userDetails.profession,
          "age": userDetails.age,
          "experience": userDetails.experience,
          "level": userDetails.level,
        };

        console.log("REQUEST BODY :",JSON.stringify(apiRequestBody))
        const response = await fetch("http://127.0.0.1:8000/learnaskai", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
        });
    
        console.log("RESPONSE:", response);
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const responseData = await response.json();
        setResult(responseData.content);
        console.log("result",responseData.content)

        // Store the user topics in the "users" table
     // Assuming 1 means the topic is selected
     storeUserTopics(user.email,maintopic);
    

        const key ="AIzaSyA_cxjTyiZMP1vU26kEsJkiKIPUHD-7QCg"
      
        const yresponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&maxResults=8&order=viewCount&q=${topic} in data structures and algorithms`)

      if (!yresponse.ok) {
        throw new Error(`HTTP error! Status: ${yresponse.status}`);
      }

      const yData = await yresponse.json();
      setVideoLink(yData.items);
      getUserTopics(user.email);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingButton(false);
    }
    };
        return (
          <div>
            <Topbar/>
            <div className={styles1.main}>
              <div className ={styles1.sidebar}>
                  <div className ={styles1.upperSide}>
                <button className={styles1.midBtn}>History</button>
                {allTopics && allTopics.map((item, index) => (
    <div key={index}>
        <button className={styles1.quer}>
            <img className={styles1.image1} onClick={() => handleTopicButtonClick(item)} src={msgIcon} alt="query" />
            {item}
            <img className={styles1.image2} src={Del} onClick={() => handleDelete(item)} alt="query" />
        </button>
    </div>
))}

                </div>
            </div>

            <div className = {styles1.right}>
                <Hero />
               <div className={styles1.bottomsection}>
                   <div className={styles1.messagebar}>
                      <input
                      type="text"
                       placeholder="What do you want to explore ..."
                       onChange={(e) => setTopic(e.target.value)}
                      value={topic}
                       />
                       <button onClick={() => handleSubmit(topic)}>
				              {!isLoading &&  <svg
                       onClick={() => handleSubmit(topic)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6`}
                        >
                      <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                      />
                      {isLoadingButton && <AiOutlineLoading3Quarters className="animate-spin" />}
                      </svg>}
				{isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
			</button>
                      
                    
                   </div>
        </div>
            
            <div>
              {isLoading && result ? (
               <><LoadingSkeleton /></>
              ):(
                <div ref={resultRef}> <motion.div variants={textVariant()}>
                <div className="rounded-md  m-20 p-8 shadow-xl">
                <ReactMarkdown className="prose pt-3  text-white  p-8 rounded-md shadow-xl z-10">{result}</ReactMarkdown>      
          </div>
                      </motion.div></div>
              )}
              

              {Array.isArray(videolink) && videolink.length > 0 && (
                <motion.div variants={textVariant()}>
                  <h2 className={`${styles.sectionHeadText} m-20 text-center`}>
                    VIDEOS 
                  </h2>
                </motion.div>
              )}
      
      {Array.isArray(videolink) && videolink.length > 0 && (

  <VerticalTimeline>

    {isLoading &&
      Array.from({ length: 5 }).map((_, index) => (
        <div key={`loading-video-${index}`} className="animate-pulse">
          <VerticalTimelineElement
            iconStyle={{
              background: "#1d1836",
              color: "#fff",
            }}
            contentArrowStyle={{ borderRight: "7px solid  #232631",backgroundImage: "linear-gradient(to bottom, #FFA500, #FF6347)", }}
          />
        </div>
      ))}

    <VerticalTimelineElement
            iconStyle={{
              background: "#1d1836",
              color: "#fff",
            }}
            contentArrowStyle={{ borderRight: "7px solid  #232631"}}
    />
    {!isLoading &&
      videolink.map((video, index) => (
        <VideoCard
          key={`video-${index}`}
          video={video}
          isLoading={isLoading}
        />
      ))}
     
  </VerticalTimeline>
)}
            </div>
      
            <div>
             
              {Array.isArray(linkclub) && linkclub.length > 0 && (
                <motion.div variants={textVariant()}>
                  <h2 className={`${styles.sectionHeadText} m-20 text-center`}>
                    Some Useful Content and Links
                  </h2>
                </motion.div>
              )}


{Array.isArray(linkclub) && linkclub.length > 0 && 
              (
                <div>
                {isLoading ?
                   (
                    <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
                      {[...Array(10)].map((_, idx) => (
                        <LoadingSkeleton key={idx} />
                      ))}
                    </div>
                    ):(
                      <VerticalTimeline>
                      {!isLoading &&
                      linkclub.slice(0, 8).map((link, index) => (
                        <ExperienceCard key={`experience-${index}`} link={link} />
                      ))}
                      </VerticalTimeline>
                      )}
                </div>    
              )
}
</div>
</div>
</div></div>
);
};  
export default App;