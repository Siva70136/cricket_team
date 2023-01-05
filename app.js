const express = require("express");

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDb = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000);

    console.log("server is created");
  } catch (e) {
    console.log(`error msg is ${e.message}`);
  }
};

initializeDb();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,

    playerName: dbObject.player_name,

    jerseyNumber: dbObject.jersey_number,

    role: dbObject.role,
  };
};
app.get("/players/", async (request, response) => {
  const getQuery = `SELECT * FROM cricket_team; `;

  const playersArray = await db.all(getQuery);

  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.post("/players/", async (request, response) => {
  const teamDetails = request.body;

  const { playerName, jerseyNumber, role } = teamDetails;

  const getQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES ('${playerName}','${jerseyNumber}','${role}'); `;

  const data = await db.run(getQuery);

  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}; `;

  const data = await db.get(getQuery);

  response.send(convertDbObjectToResponseObject(data));
});

app.put("/players/:playerId/", async (request, response) => {
  const teamDetails = request.body;

  const { playerId } = request.params;

  const { playerName, jerseyNumber, role } = teamDetails;

  const putQuery = `UPDATE cricket_team SET  player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}' WHERE player_id=${playerId}; `;

  const data = await db.run(putQuery);

  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const putQuery = `DELETE FROM  cricket_team WHERE player_id=${playerId}; `;

  const data = await db.run(putQuery);

  response.send("Player Removed");
});

module.exports = app;
