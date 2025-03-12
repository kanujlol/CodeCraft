/*import { problems } from '../../mockProblems/problems'
import React, {useEffect,useState} from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { IoClose } from "react-icons/io5";
import { AiFillYoutube } from 'react-icons/ai'
import YouTube from "react-youtube";
import { Link } from 'react-router-dom'

export default function ProblemsTable() {
    return (
        <>
            <tbody className="text-white">
                {problems.map((problem, idx) => {
                    const difficultyColor =
                        problem.difficulty === "Easy"
                            ? "text-dark-green-s"
                            : problem.difficulty === "Medium"
                                ? "text-dark-yellow"
                                : "text-dark-pink";
                    return (
                        <tr className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""}`} key={problem.id}>
                            <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                                <BsCheckCircle fontSize={"18"} width="18" />
                            </th>
                            <td className="px-6 py-4">
                                <Link to={`/problems/${problem.id}`} className="hover:text-blue-600 cursor-pointer">
                                    {problem.title}
                                </Link>
                            </td>
                            <td className={`px-6 py-4 ${difficultyColor}`}>
                                {problem.difficulty}
                            </td>
                            <td className={"px-6 py-4"}>
                                {problem.category}
                            </td>
                            <td className={"px-6 py-4"}>
                                {problem.videoId ? (
                                    <AiFillYoutube fontSize={"28"}
                                    className="cursor-pointer hover:text-red-600"/>
                                ) : (
                                    <p className="text-gray-400">Coming soon</p>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </>
    )
}
// Import necessary libraries and components*/
/*import React, { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/supabase'; // Import supabase client
export default function ProblemsTable() {
  const [problems, setProblems] = useState([]);
  const [youtubePlayer, setYoutubePlayer] = useState({
		isOpen: false,
		videoId: "",
	});
  const [questions, setQuestions] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const closeModal = () => {
		setYoutubePlayer({ isOpen: false, videoId: "" });
	};
  // Fetch problems data
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  useEffect(() => { 
    // Assuming you have a 'problems' table in your Supabase database
    const fetchProblems = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) {
        console.error('Error fetching problems:', error.message);
      } else {
        setProblems(data);
      }
    };
    fetchProblems();
  }, []);
  // Fetch questions data when a problem is selected
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedProblem) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', selectedProblem.id); // Assuming there's a 'problem_id' column in the 'questions' table
        if (error) {
          console.error('Error fetching questions:', error.message);
        } else {
          setQuestions(data);
        }
      }
    };
    fetchQuestions();
  }, [selectedProblem]);
  const handleProblemClick = (problem) => {
    setSelectedProblem(problem);
  };
  const difficultyColor = (difficulty) => {
    return difficulty === 'Easy'
      ? 'text-dark-green-s'
      : difficulty === 'Medium'
      ? 'text-dark-yellow'
      : 'text-dark-pink';
  };
  return (
    <>
      <tbody className="text-white">
        {problems.map((problem, idx) => (
            <tr className={`${idx % 2 == 1 ? "bg-dark-layer-1" : ""}`} key={problem.id}>
            <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
              <BsCheckCircle fontSize={'18'} width="18" />
            </th>
            <td className="px-6 py-4">
              <Link
                to={`/problems/${problem.id}`}
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => handleProblemClick(problem)}
              >
                {problem.title}
              </Link>
            </td>
            <td className={`px-6 py-4 ${difficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </td>
            <td className={'px-6 py-4'}>{problem.category}</td>
            <td className={'px-6 py-4'}>
              {problem.videoId ? (
                <AiFillYoutube
                  fontSize={'28'}
                  className="cursor-pointer hover:text-red-600"
                />
              ) : (
                <p className="text-gray-400">Coming soon</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </>
  )
}*/

import React, { useEffect, useState } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { AiFillYoutube } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase/supabase'

export default function ProblemsTable({filteredProblems}) {
    const solvedProblems = useGetSolvedProblems();
    // console.log(solvedProblems)
    return (
        <>
            <tbody className="text-white">
                {filteredProblems.map((problem, idx) => {
                    const difficultyColor =
                        problem.difficulty === "Easy"
                            ? "text-dark-green-s"
                            : problem.difficulty === "Medium"
                                ? "text-dark-yellow"
                                : "text-dark-pink";
                    return (
                        <tr className={`${idx % 2 === 1 ? "bg-dark-layer-1" : ""}`} key={problem.id}>
                            <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                                {solvedProblems && solvedProblems.includes(problem.id) && <BsCheckCircle fontSize={"18"} width="18" />}
                            </th>
                            <td className="px-6 py-4">
                                <Link to={`/problems/${problem.id}`} className="hover:text-blue-600 cursor-pointer">
                                    {problem.title}
                                </Link>
                            </td>
                            <td className={`px-6 py-4 ${difficultyColor}`}>
                                {problem.difficulty}
                            </td>
                            <td className={"px-6 py-4"}>
                                {problem.category}
                            </td>
                            {/* <td className={"px-6 py-4"}>
                                {problem.videoId ? (
                                    <AiFillYoutube fontSize={"28"}
                                    className="cursor-pointer hover:text-red-600"/>
                                ) : (
                                    <p className="text-gray-400">Coming soon</p>
                                )}
                            </td> */}
                        </tr>
                    );
                })}
            </tbody>
        </>
    )
}

// function useGetProblems(setLoadingProblems){
//     const [problems,setProblems] = useState([])

//     useEffect(()=>{
//         //fetch data from db
//         const fetchProblems = async () => {
//             setLoadingProblems(false)
//             try {
//               const { data, error } = await supabase
//                 .from('Problems')
//                 .select()
//                 .order('order', { ascending: true });
        
//             //   console.log(data)
        
//               if (error) {
//                 console.error('Error fetching problems:', error);
//               } else if (data) {
//                 setProblems(data)
//                 setLoadingProblems(false)
//               }
//             } catch (error) {
//               console.error('Error fetching problems:', error);
//             }
//           };
//           fetchProblems();
//     },[setLoadingProblems])
//     return problems;
// }

function useGetSolvedProblems() {
    const [solvedProblems, setSolvedProblems] = useState([]);
  
    useEffect(() => {
      const getSolvedProblems = async () => {
        const { data: { user } } = await supabase.auth.getUser()
  
        if (user) {
            const { data,error } = await supabase
            .from('users')
            .select('solvedProblems')
            .eq('id',user.id)

            setSolvedProblems(data[0].solvedProblems)
        }
        else{
            setSolvedProblems([])
        }
      };
      getSolvedProblems();
    }, []);
  
    return solvedProblems;
  }