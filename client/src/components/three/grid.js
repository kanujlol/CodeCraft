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
const Learn =() => {
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
      experience: "",
      level: 0,
    });
  const [allTopics, setAllTopics] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

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
      

  
    const handleSubmit = async (maintopic) => {
      setTopic(maintopic);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to submit", { position: "top-center", autoClose: 3000, theme: "dark" });
        return;
      }

      try {
        setIsLoading(true);
        setIsLoadingButton(true);
       
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          

        console.log(data)

        setUserDetails({
          profession: data[0].profession,
          age: data[0].age,
          experience: data[0].experience,
          level: data[0].level,
        });
    
        console.log("DETAILS:", userDetails);
    
        const apiRequestBody = {
          "topic": maintopic,
          "profession": userDetails.profession,
          "age": userDetails.age,
          "level": userDetails.level,
          "experience": userDetails.experience,
          "prev_response": JSON.parse(localStorage.getItem("ai-prev-response"))
         
        };

        console.log("REQUEST BODY :",JSON.stringify(apiRequestBody))
        const response = await fetch("http://127.0.0.1:8000/askAI/", {
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
        setResult(responseData.response);
        console.log("result",responseData.response)
        localStorage.setItem("ai-prev-response",JSON.stringify(responseData.response))
    

        const key ="AIzaSyA_cxjTyiZMP1vU26kEsJkiKIPUHD-7QCg"
      
        const yresponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&maxResults=8&order=viewCount&q=${maintopic} in data structures and algorithms`)

      if (!yresponse.ok) {
        throw new Error(`HTTP error! Status: ${yresponse.status}`);
      }

      const yData = await yresponse.json();
      setVideoLink(yData.items);


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
            <img className={styles1.image2} src={Del}  alt="query" />
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
export default Learn;