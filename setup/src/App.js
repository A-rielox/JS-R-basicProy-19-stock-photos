import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

import Photo from './Photo';

// REACT_APP_ACCES_KEY
const clientID = `?client_id=${process.env.REACT_APP_ACCES_KEY}`;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
   const [loading, setLoading] = useState(false);
   const [photos, setPhotos] = useState([]);
   const [page, setPage] = useState(1);
   const [query, setQuery] = useState('');
   const [newImages, setNewImages] = useState(false);
   const mounted = useRef(false);

   const fetchImages = async () => {
      setLoading(true);

      let url;
      const urlPage = `&page=${page}`;
      const urlQuery = `&query=${query}`;

      if (query) {
         url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      } else {
         url = `${mainUrl}${clientID}${urlPage}`;
      }

      try {
         const response = await fetch(url);
         const data = await response.json();

         setPhotos(oldPhotos => {
            if (query && page === 1) {
               return data.results;
            } else if (query) {
               return [...oldPhotos, ...data.results];
            } else {
               return [...oldPhotos, ...data];
            }
         });
         setNewImages(false); // va antes del setLoading
         setLoading(false);

         //
      } catch (error) {
         setNewImages(false); // va antes del setLoading

         setLoading(false);
      }
   };

   useEffect(() => {
      fetchImages();
      // eslint-disable-next-line
   }, [page]);

   // para q no corra en el primer render, solo a partir del segundo
   useEffect(() => {
      if (!mounted.current) {
         mounted.current = true;
         return;
      }
      if (!newImages) return;
      if (loading) return;

      setPage(oldPage => oldPage + 1);
      // eslint-disable-next-line
   }, [newImages]);

   const event = () => {
      if (
         window.innerHeight + window.scrollY >=
         document.body.scrollHeight - 2
      ) {
         setNewImages(true);
      }
   };

   useEffect(() => {
      window.addEventListener('scroll', event);

      return () => window.removeEventListener('scroll', event);
   }, []);

   const handleSubmit = e => {
      e.preventDefault();
      if (!query) return;

      if (page === 1) {
         fetchImages();
         return;
      }
      setPage(1);
   };

   return (
      <main>
         <section className="search">
            <form className="search-form">
               <input
                  type="text"
                  placeholder="search"
                  className="form-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
               />

               <button
                  type="submit"
                  className="submit-btn"
                  onClick={handleSubmit}
               >
                  <FaSearch />
               </button>
            </form>
         </section>

         <section className="photos">
            <div className="photos-center">
               {photos.map(image => {
                  return <Photo key={image.id} {...image} />;
               })}
            </div>
            {loading && <h2 className="loading">loading...</h2>}
         </section>
      </main>
   );
}

export default App;

// KEY
// XNsOG9D9YKBvaXchVrluIBk73Ejpz4jwwpLfGOdUv2Y
// The API is available at https://api.unsplash.com/. Responses are sent as JSON.

// To authenticate requests
// https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY

// en el archivo .env el nombre debe empezar con "REACT_APP_" ( para una env de proyecto react )

//
// leer comentarios de este

/*    ANTES DEL REFACTOR 

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

import Photo from './Photo';

// REACT_APP_ACCES_KEY
const clientID = `?client_id=${process.env.REACT_APP_ACCES_KEY}`;

const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
   const [loading, setLoading] = useState(false);
   const [photos, setPhotos] = useState([]);
   const [page, setPage] = useState(0);
   const [query, setQuery] = useState('');

   // Link: <https://api.unsplash.com/search/photos?page=1&query=office>

   const fetchImages = async () => {
      setLoading(true);

      let url;
      const urlPage = `&page=${page}`;
      const urlQuery = `&query=${query}`;

      if (query) {
         url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
      } else {
         url = `${mainUrl}${clientID}${urlPage}`;
      }

      try {
         const response = await fetch(url);
         const data = await response.json();

         setPhotos(oldPhotos => {
            if (query && page === 1) {
               return data.results;
            } else if (query) {
               return [...oldPhotos, ...data.results];
            } else {
               return [...oldPhotos, ...data];
            }
         });
         setLoading(false);

         //
      } catch (error) {
         setLoading(false);
         console.log(error);
      }
   };

   useEffect(() => {
      fetchImages();
      // eslint-disable-next-line
   }, [page]);

   // document.body.scrollHeight -> 3
   // window.innerHeight -> 2,  window.scrollY ->1
   // "3" -> es cuanto mide el documento,  "2" -> es la altura de la ventana , xlo tanto, cuando '1' + '2' = '3' es que llegue al fin del documento
   useEffect(() => {
      const event = window.addEventListener('scroll', () => {
         if (
            !loading &&
            window.innerHeight + window.scrollY >=
               document.body.scrollHeight - 2
         ) {
            setPage(page => page + 1);
         }
      });
      //!loading && -> pa q al llegar abajo si es que esta cargando imagener (haciendo el fetch ) no se ponga a hacer mas request mientras cargan las fotos 

      return () => window.removeEventListener('scroll', event);
      // eslint-disable-next-line
   }, []);

   const handleSubmit = e => {
      e.preventDefault();
      setPage(1);
   };

   return (
      <main>
         <section className="search">
            <form className="search-form">
               <input
                  type="text"
                  placeholder="search"
                  className="form-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
               />

               <button
                  type="submit"
                  className="submit-btn"
                  onClick={handleSubmit}
               >
                  <FaSearch />
               </button>
            </form>
         </section>

         <section className="photos">
            <div className="photos-center">
               {photos.map(image => {
                  return <Photo key={image.id} {...image} />;
               })}
            </div>
            {loading && <h2 className="loading">loading...</h2>}
         </section>
      </main>
   );
}

export default App;

// KEY
// XNsOG9D9YKBvaXchVrluIBk73Ejpz4jwwpLfGOdUv2Y
// The API is available at https://api.unsplash.com/. Responses are sent as JSON.

// To authenticate requests
// https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY

*/
