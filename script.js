const pokemonList = document.getElementById("pokemonList");
const typeFilter = document.getElementById("typeFilter");

let allPokemon = [];
let pokemonTypes = [];

async function fetchPokemonData() {
  try {
    // Fetch the first 150 Pokémon for simplicity
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
    const data = await response.json();

    // Log the data to check the response
    console.log("Pokémon List Data: ", data);

    // Fetch details for each Pokémon
    for (const pokemon of data.results) {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();

      console.log("Pokémon Data: ", pokemonData); // Debugging Pokémon details

      allPokemon.push(pokemonData);
      pokemonData.types.forEach(typeInfo => {
        if (!pokemonTypes.includes(typeInfo.type.name)) {
          pokemonTypes.push(typeInfo.type.name);
        }
      });
    }

    // Populate the type filter dropdown
    pokemonTypes.forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      typeFilter.appendChild(option);
    });

    // Display all Pokémon by default
    displayPokemon(allPokemon);

    // Event listener for type filtering
    typeFilter.addEventListener("change", filterPokemonByType);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

function displayPokemon(pokemonArray) {
  pokemonList.innerHTML = ""; // Clear the current Pokémon list

  if (pokemonArray.length === 0) {
    pokemonList.innerHTML = "<p>No Pokémon found.</p>";
    return;
  }

  pokemonArray.forEach(pokemon => {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name; // Add alt text for accessibility
    pokemonCard.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokemonCard.appendChild(name);

    const types = document.createElement("p");
    types.textContent = pokemon.types.map(type => type.type.name).join(", ");
    pokemonCard.appendChild(types);

    pokemonList.appendChild(pokemonCard);
  });
}

function filterPokemonByType() {
  const selectedType = typeFilter.value;

  if (selectedType) {
    const filteredPokemon = allPokemon.filter(pokemon => 
      pokemon.types.some(type => type.type.name === selectedType)
    );
    displayPokemon(filteredPokemon);
  } else {
    displayPokemon(allPokemon);
  }
}

// Initialize the app
fetchPokemonData();
