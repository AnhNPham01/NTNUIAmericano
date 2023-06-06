// pages/index.tsx
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import Link from "next/link";

interface Item {
    medlemsid: number;
    fornavn: string;
    etternavn: string;
}

interface HomeProps {
    data: Item[] | null;
    error: string | null;
}

const sendData = async (
    number: number
): Promise<{ data: Item[] | null; error: string | null }> => {
    try {
        const res = await fetch(
            `http://localhost:3000/api/get-data?number=${number}`
        );
        const data = await res.json();

        return {
            data,
            error: null,
        };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unknown error occurred";
        return {
            data: null,
            error: errorMessage,
        };
    }
};

function generateRounds(data: any[]): any[][][] {
    let numPlayers = data.length;

    let players = data.map(
        (item) => item.fornavn + " " + item.etternavn[0] + "."
    );

    console.log(players);

    let rounds: any[][][] = [];

    if (numPlayers === 4) {
        rounds = [
            [[players[0], players[1]], [players[2], players[3]], []],
            [[players[0], players[2]], [players[1], players[3]], []],
            [[players[0], players[3]], [players[1], players[2]], []],
        ];
    } else {
        for (let i = 0; i < numPlayers; i++) {
            let round: any[][] = [[], [], []];
            for (let j = 0; j < 4; j++) {
                let playerIndex = (i + j) % numPlayers;
                if (j < 2) {
                    round[0].push(players[playerIndex]);
                } else {
                    round[1].push(players[playerIndex]);
                }
            }
            round[2] = players.filter(
                (player: any) => ![...round[0], ...round[1]].includes(player)
            );
            rounds.push(round);
        }
    }

    console.log(rounds);

    return rounds;
}

export const getServerSideProps: GetServerSideProps<
    HomeProps
> = async (): Promise<GetServerSidePropsResult<HomeProps>> => {
    const numberToSend = 40; // Replace with the desired number
    const { data, error } = await sendData(numberToSend);

    return {
        props: {
            data,
            error,
        },
    };
};

const Home: React.FC<HomeProps> = ({ data, error }) => {
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data || !Array.isArray(data)) {
        return <div>Loading...</div>;
    }
    return (
        <div className="h-screen">
            <p className="text-4xl">Americano</p>
            <table>
                <thead>
                    <tr>
                        <th>MedlemsID</th>
                        <th>Fornavn</th>
                        <th>Etternavn</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={`${item.medlemsid}-${item.fornavn}-${item.etternavn}`}
                        >
                            <td>{item.medlemsid}</td>
                            <td>{item.fornavn}</td>
                            <td>{item.etternavn}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-2">
                <p className="font-bold">Spillere</p>
                {data.map((item) => (
                    <div>
                        {item.fornavn} {item.etternavn[0]}.
                    </div>
                ))}
            </div>
            <div>{generateRounds(data)}</div>
        </div>
    );
};

export default Home;
