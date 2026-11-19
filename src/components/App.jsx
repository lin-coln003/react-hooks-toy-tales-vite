import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleLikeToy(toy) {
    const response = await fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1,
      }),
    });

    if (response.ok) {
      const updatedToy = await response.json();

      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === updatedToy.id ? updatedToy : currentToy
        )
      );
    }
  }

  async function handleDeleteToy(id) {
    const response = await fetch(`http://localhost:3000/toys/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setToys((currentToys) =>
        currentToys.filter((toy) => toy.id !== id)
      );
    }
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm /> : null}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;