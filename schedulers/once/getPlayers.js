import { getPlayers } from "../../api/liquipedia";

export async function getPlayersFromLiquipedia(){
    try {
            let os = 0;
    
            let players = await getPlayers("valorant", 1000, os)
            await Promise.all(
                players.map(async (p) => {
                    const tournament = await getTournamentByPagename(p.pagename);
                    return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
                })
            );
            while (players.length > 999) {
                os += 1000;
                players = await getPlayers("valorant", 1000, os)
                await Promise.all(
                    players.map(async (p) => {
                        const tournament = await getTournamentByPagename(p.pagename);
                        return await createPlacement({ ...p, tournamentId: tournament ? tournament.id : null });
                    })
                );
            }
        } catch (error) {
            console.error("Error Adding placements: ", error);
        }
}