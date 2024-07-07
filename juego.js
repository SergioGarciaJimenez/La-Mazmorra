document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game-container");
  const mapWidth = 20;
  const mapHeight = 15;
  let player = {
    name: "Garzy",
    level: 1,
    experience: 0,
    gold: 0,
    position: { x: 0, y: 0 },
  };

  let map = generateMap(player.level);

  let coin = document.getElementById("coin");

  let kill = document.getElementById("kill");

  let levelUp = document.getElementById("levelUp");

  function generateMap(level) {
    const map = [];
    for (let y = 0; y < mapHeight; y++) {
      const row = [];
      for (let x = 0; x < mapWidth; x++) {
        row.push(Math.random() > 0.8 ? "wall" : "floor");
      }
      map.push(row);
    }
    placeEntities(map, level);
    return map;
  }

  function placeEntities(map, level) {
    map[0][0] = "player";
    player.position = { x: 0, y: 0 };

    for (let i = 0; i < 3 * level; i++) {
      const enemyX = Math.floor(Math.random() * mapWidth);
      const enemyY = Math.floor(Math.random() * mapHeight);
      if (map[enemyY][enemyX] === "floor" || map[enemyY][enemyX] === "wall") {
        map[enemyY][enemyX] = "enemy";
      }
    }

    for (let i = 0; i < 3 * level; i++) {
      const itemX = Math.floor(Math.random() * mapWidth);
      const itemY = Math.floor(Math.random() * mapHeight);
      if (map[itemY][itemX] === "floor" || map[itemY][itemX] === "wall") {
        map[itemY][itemX] = "item";
      }
    }
  }

  function renderMap(map) {
    gameContainer.innerHTML = "";
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tile = document.createElement("div");
        tile.classList.add("tile", map[y][x]);
        if (x === player.position.x && y === player.position.y) {
          tile.classList.add("player");
        }
        gameContainer.appendChild(tile);
      }
    }
    gameContainer.innerHTML += `<div class='menu'>
            <p>Nombre: ${player.name}</p> <p>Nivel: ${player.level}</p> <p>Experiencia: ${player.experience}</p> <p> Oro: ${player.gold}</p>
        </div>`;
  }

  function handleKeydown(event) {
    let newX = player.position.x;
    let newY = player.position.y;

    map[0][0] = "floor";

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
    if (map[newY][newX] !== "wall") {
      player.position = { x: newX, y: newY };
      checkTile(map[newY][newX]);
      map[newY][newX] = "floor";
    }

    renderMap(map);
  }

  function checkTile(tile) {
    if (tile === "enemy") {
      player.experience += 5;
      kill.play();
    } else if (tile === "item") {
      rand = Math.floor(Math.random() * (50 - 10) + 10);
      coin.play();
      player.gold += rand;
    }

    if (player.experience >= player.level * 10) {
      player.level++;
      player.experience = 0;
      levelUp.play();
      map = generateMap(player.level);
    }
  }

  renderMap(map);
  window.addEventListener("keydown", handleKeydown);
});
