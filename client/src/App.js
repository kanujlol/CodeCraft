import ProblemsTable from "./components/ProblemsTable/ProblemsTable";
import Topbar from "./components/Topbar/Topbar";
import { useState, useEffect } from "react";
import useHasMounted from './Hooks/useHasmounted'
import { supabase } from "./supabase/supabase";

// function App() {
//   const [loadingProblems, setLoadingProblems] = useState(true);
//   const [selectedDifficulty, setSelectedDifficulty] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const problems = useGetProblems(setLoadingProblems);

//   const filteredProblems = problems.filter(problem => {
//     if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
//       return false;
//     }
//     if (selectedType && problem.category !== selectedType) {
//       return false;
//     }
//     return true;
//   });

//   // Function to handle difficulty filter selection
//   const handleDifficultyFilter = (difficulty) => {
//     setSelectedDifficulty(difficulty);
//   };

//   // Function to handle problem type filter selection
//   const handleTypeFilter = (type) => {
//     setSelectedType(type);
//   };

//   const resetFilters = () => {
//     setSelectedDifficulty(null);
//     setSelectedType(null);
//   };


//   const hasMounted = useHasMounted();
//   if (!hasMounted) return null;
//   return (
//     <>
//       <main className="bg-dark-layer-2 min-h-screen">
//         <Topbar />
//         <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
//           &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
//         </h1>
//         <div className="sm:w-7/12 w-full max-w-[1200px] mx-auto my-3 flex flex-wrap justify-start">
//           <span className={`filter-button ${!selectedDifficulty && !selectedType ? 'selected' : ''}`} onClick={() => resetFilters()}>All</span>
//           <span className={`filter-button ${selectedDifficulty === "Easy" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Easy")}>Easy</span>
//           <span className={`filter-button ${selectedDifficulty === "Medium" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Medium")}>Medium</span>
//           <span className={`filter-button ${selectedDifficulty === "Hard" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Hard")}>Hard</span>
//           <span className={`filter-button ${selectedType === "Dynamic Programming" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Dynamic Programming")}>Dynamic Programming</span>
//           <span className={`filter-button ${selectedType === "Two Pointers" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Two Pointers")}>Two Pointers</span>
//           <span className={`filter-button ${selectedType === "Array" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Array")}>Array</span>
//         </div>

//         <div className="relative overflow-x-auto mx-auto px-6 pb-10">
//           {loadingProblems && (
//             <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
//               {[...Array(10)].map((_, idx) => (
//                 <LoadingSkeleton key={idx} />
//               ))}
//             </div>
//           )}
//           <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
//             {!loadingProblems && (
//               <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
//                 <tr>
//                   <th scope="col" className="px-1 py-3 w-0 font-medium">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 w-0 font-medium">
//                     Title
//                   </th>
//                   <th scope="col" className="px-6 py-3 w-0 font-medium">
//                     Difficulty
//                   </th>

//                   <th scope="col" className="px-6 py-3 w-0 font-medium">
//                     Category
//                   </th>
//                   <th scope="col" className="px-6 py-3 w-0 font-medium">
//                     Solution
//                   </th>
//                 </tr>
//               </thead>
//             )}
//             <ProblemsTable filteredProblems={filteredProblems} />
//           </table>
//         </div>
//       </main>
//     </>

//   );
// }
function App() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const problems = useGetProblems(setLoadingProblems);

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event === "PASSWORD_RECOVERY") {
  //       const newPassword = prompt("What would you like your new password to be?");
  //       const { data, error } = await supabase.auth
  //         .updateUser({ password: newPassword })
 
  //       if (data) alert("Password updated successfully!")
  //       if (error!==null) alert("There was an error updating your password.")
  //     }
  //   })
  // }, [])


  const filteredProblems = problems.filter(problem => {
    if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedType && problem.category !== selectedType) {
      return false;
    }
    return true;
  });

  // Function to handle difficulty filter selection
  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  // Function to handle problem type filter selection
  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const resetFilters = () => {
    setSelectedDifficulty(null);
    setSelectedType(null);
  };


  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  return (
    <main className="bg-dark-layer-2 min-h-screen">
      <Topbar />
      {/* <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase pt-10 pb-10 bg-dark-layer-2 ">
            &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
      </h1> */}
        <div className="flex gap-5 py-10 justify-evenly">
        {/* <div className=""> */}
        <div className="md:w-56 flex flex-wrap justify-start h-64">
          <span className={`filter-button ${!selectedDifficulty && !selectedType ? 'selected' : ''}`} onClick={() => resetFilters()}>All</span>
          <span className={`filter-button ${selectedDifficulty === "Easy" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Easy")}>Easy</span>
          <span className={`filter-button ${selectedDifficulty === "Medium" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Medium")}>Medium</span>
          <span className={`filter-button ${selectedDifficulty === "Hard" ? 'selected' : ''}`} onClick={() => handleDifficultyFilter("Hard")}>Hard</span>
          <span className={`filter-button ${selectedType === "Dynamic Programming" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Dynamic Programming")}>Dynamic Programming</span>
          <span className={`filter-button ${selectedType === "Two Pointers" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Two Pointers")}>Two Pointers</span>
          <span className={`filter-button ${selectedType === "Array" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Array")}>Array</span>
          <span className={`filter-button ${selectedType === "Linked List" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Linked List")}>Linked List</span>
          <span className={`filter-button ${selectedType === "Stack" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Stack")}>Stack</span>
          <span className={`filter-button ${selectedType === "Binary Search" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Binary Search")}>Binary Search</span>
          <span className={`filter-button ${selectedType === "Binary Tree" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Binary Tree")}>Binary Tree</span>
          <span className={`filter-button ${selectedType === "Intervals" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Intervals")}>Intervals</span>
          <span className={`filter-button ${selectedType === "Sliding Window" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Sliding Window")}>Sliding Window</span>
          <span className={`filter-button ${selectedType === "Back Tracking" ? 'selected' : ''}`} onClick={() => handleTypeFilter("Back Tracking")}>Back Tracking</span>
        </div>
        {/* </div> */}
        <div className="overflow-x-auto md:w-1/2 flex flex-col">
          {loadingProblems && (
            <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
              {[...Array(10)].map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          )}
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full max-w-[1200px] mx-auto">
            {!loadingProblems && (
              <thead className="text-xs text-gray-500 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                </tr>
              </thead>
            )}
            <ProblemsTable filteredProblems={filteredProblems} />
          </table>
        </div>
        </div>
    </main>
  );
}


export default App;

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

function useGetProblems(setLoadingProblems) {
  const [problems, setProblems] = useState([])

  useEffect(() => {
    //fetch data from db
    const fetchProblems = async () => {
      setLoadingProblems(false)
      try {
        const { data, error } = await supabase
          .from('Problems')
          .select()
          .order('order', { ascending: true });

        //   console.log(data)

        if (error) {
          console.error('Error fetching problems:', error);
        } else if (data) {
          setProblems(data)
          setLoadingProblems(false)
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, [setLoadingProblems])
  return problems;
}