document.addEventListener("DOMContentLoaded", () => {
  // The game container
  const gameContainer = document.getElementById("game-container");
  // The map size
  const mapWidth = 20;
  const mapHeight = 15;
  // Player info
  let player = {
    name: "Garzy",
    level: 1,
    experience: 0,
    gold: 0,
    position: { x: 0, y: 0 },
  };

  // Creates the map
  let map = generateMap(player.level);

  // Vars for sounds
  let coin = document.getElementById("coin");

  let kill = document.getElementById("kill");

  let levelUp = document.getElementById("levelUp");

  // Functions

  // Creates the map according to player's level
  function generateMap(level) {
    const map = [];

    // Iterates every map square
    for (let y = 0; y < mapHeight; y++) {
      const row = [];
      for (let x = 0; x < mapWidth; x++) {
        // Randomly chooses wall or floor
        row.push(Math.random() > 0.8 ? "wall" : "floor");
      }
      map.push(row);
    }

    // The squares next to the player have to remain as "floor"
    const safeZones = [
      { x: player.position.x + 1, y: player.position.y },
      { x: player.position.x, y: player.position.y + 1 },
      { x: player.position.x + 1, y: player.position.y + 1 },
    ];

    // We iterate the safe zones
    safeZones.forEach((pos) => {
      if (pos.x < mapWidth && pos.y < mapHeight) {
        map[pos.y][pos.x] = "floor";
      }
    });

    // Now it's time to place the entities
    placeEntities(map, level);
    return map;
  }

  // Function that place the entities (enemies and gold)

  function placeEntities(map, level) {
    // The player starting position
    map[0][0] = "player";
    player.position = { x: 0, y: 0 };

    // 3 enemies for each player's level
    for (let i = 0; i < 3 * level; i++) {
      // We place randomly each enemy
      const enemyX = Math.floor(Math.random() * mapWidth);
      const enemyY = Math.floor(Math.random() * mapHeight);
      if (map[enemyY][enemyX] === "floor" || map[enemyY][enemyX] === "wall") {
        map[enemyY][enemyX] = "enemy";
      }
    }

    // 3 gold items for each player's level
    for (let i = 0; i < 3 * level; i++) {
      // We place randomly each gold item
      const goldX = Math.floor(Math.random() * mapWidth);
      const goldY = Math.floor(Math.random() * mapHeight);
      if (map[goldY][goldX] === "floor" || map[goldY][goldX] === "wall") {
        map[goldY][goldX] = "gold";
      }
    }
  }

  // Function that renders the map
  function renderMap(map) {
    // We reset the container
    gameContainer.innerHTML = "";
    // We iterate all the map
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        // We create a div for each tile
        const tile = document.createElement("div");
        tile.classList.add("tile", map[y][x]);
        // If the tile contains the player
        if (x === player.position.x && y === player.position.y) {
          tile.classList.add("player");
        }
        // We add the div to the container
        gameContainer.appendChild(tile);
      }
    }
    // We add a little menu which shows the player data
    gameContainer.innerHTML += `<div class='menu'>
            <p>Nombre: ${player.name}</p> <p>Nivel: ${player.level}</p> <p>Experiencia: ${player.experience}</p> <p> Oro: ${player.gold}</p>
        </div>`;
  }

  // Function that handles the key presses
  function handleKeydown(event) {
    // Obtains the player's new position
    let newX = player.position.x;
    let newY = player.position.y;

    // The first time the player moves, we have to clean the initial tile
    map[0][0] = "floor";

    // Checking where the player has moved
    switch (event.key) {
      case "ArrowUp":
        newY = Math.max(0, player.position.y - 1);
        break;
      case "ArrowDown":
        newY = Math.min(mapHeight - 1, player.position.y + 1);
        break;
      case "ArrowLeft":
        newX = Math.max(0, player.position.x - 1);
        break;
      case "ArrowRight":
        newX = Math.min(mapWidth - 1, player.position.x + 1);
        break;
    }
    // Checking if the player can move there (there is not a wall)
    if (map[newY][newX] !== "wall") {
      player.position = { x: newX, y: newY };
      checkTile(map[newY][newX]);
      map[newY][newX] = "floor";
    }
    // We render the map with the new position
    renderMap(map);
  }

  // Function that check if the tile we passed contains an enemy or gold
  function checkTile(tile) {
    if (tile === "enemy") {
      // If the tile contains an enemy, we gain experience and play the killing sound
      player.experience += 5;
      // Stopping all the sounds
      document.querySelectorAll("audio").forEach(function (audio) {
        audio.pause();
        audio.currentTime = 0;
      });
      // Then playing the kill sound
      kill.play();
    } else if (tile === "gold") {
      // Otherwise, if it contains gold, we achieve a random amount and play the coin sound
      rand = Math.floor(Math.random() * (50 - 10) + 10);
      // Stopping all the sounds
      document.querySelectorAll("audio").forEach(function (audio) {
        audio.pause();
        audio.currentTime = 0;
      });
      // Then playing the coin sound
      coin.play();
      player.gold += rand;
    }

    // Checking if the player has enough experience for level up
    if (player.experience >= player.level * 10) {
      // If so, we reset the experience, and regenerate the map
      player.level++;
      player.experience = 0;
      // Playing the level up sound
      levelUp.play();
      map = generateMap(player.level);
    }
  }
  renderMap(map);
  // The keyboard arrows listener
  window.addEventListener("keydown", handleKeydown);
});
