import { problems } from '../../mockProblems/problems'
import React from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { AiFillYoutube } from 'react-icons/ai'
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
