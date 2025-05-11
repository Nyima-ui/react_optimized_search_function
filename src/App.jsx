import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchText);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  useEffect(() => {
    const fetchBooks = async (title) => {
      if (!title) {
        setBooks([]);
        setDisplayedBooks([]);
        return;
      }
      setLoading(true);
      setDisplayedBooks([]);
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?title=${title}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setBooks(result.docs || []);
      } catch (error) {
        console.log("Fetching books failed", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks(debouncedTerm);
  }, [debouncedTerm]);

  useEffect(() => {
    setDisplayedBooks(books.slice(0, 20));
  }, [books]);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      const hasMoreBooks = displayedBooks.length < books.length;

      if (
        isNearBottom &&
        !loading &&
        hasMoreBooks &&
        displayedBooks.length > 0
      ) {
        console.log("Condition met: Loading next batch of books!");

        const nextBatchStartIndex = displayedBooks.length;

        const nextBatchEndIndex = Math.min(
          books.length,
          nextBatchStartIndex + 20
        );

        const nextBatch = books.slice(nextBatchStartIndex, nextBatchEndIndex);

        setDisplayedBooks((prevDisplayedBooks) => [
          ...prevDisplayedBooks,
          ...nextBatch,
        ]);
      }

      //  if(isNearBottom && !loading &&)
      console.log(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, books, displayedBooks]);

  return (
    <>
      <input
        type="text"
        className="input_field"
        placeholder="Search for books"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {loading && <h1 className="loading_text">Loading...</h1>}

      <section className="search_results">
        {displayedBooks?.map((book, i) => (
          <p key={i} className="book_titles">
            {book.title}
          </p>
        ))}
      </section>
    </>
  );
}

export default App;
