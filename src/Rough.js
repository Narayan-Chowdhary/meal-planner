// import React from "react";
// import { useSearchBox, useHits } from "react-instantsearch-dom";
// import algoliasearch from "algoliasearch";

// const App = () => {
//   const searchClient = algoliasearch("<YOUR_APP_ID>", "<YOUR_API_KEY>");
//   const indexName = "<YOUR_INDEX_NAME>";

//   const SearchBox = () => {
//     const { refine, query } = useSearchBox({ searchClient, indexName });

//     return (
//       <input
//         type="text"
//         placeholder="Search..."
//         value={query}
//         onChange={(e) => refine(e.target.value)}
//       />
//     );
//   };

//   const Hits = () => {
//     const { hits } = useHits({ searchClient, indexName });

//     return (
//       <ul>
//         {hits.map((hit) => (
//           <li key={hit.objectID}>{hit.title}</li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <div>
//       <SearchBox />
//       <Hits />
//     </div>
//   );
// };

// export default App;
// // Remember to replace <YOUR_APP_ID>, <YOUR_API_KEY>, and <YOUR_INDEX_NAME>
     
// //      with your actual Algolia credentials and index name. You can use this code
// //       as a standalone React component or integrate it into your existing application.