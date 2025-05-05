import React, { useEffect, useState } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { AiFillYoutube } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase/supabase'

export default function ProblemsTable({filteredProblems}) {
    const solvedProblems = useGetSolvedProblems();
    console.log(solvedProblems)
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
      //console.log(user);
        if (user) {
          console.log(user.id)
            const { data,error } = await supabase
            .from('users')
            .select('solvedProblems')
            .eq('email',user.email)
            console.log(data);
             console.log(data[0]);
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