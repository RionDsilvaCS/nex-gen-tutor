import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";
import SubjectCard from "../../components/SubjectCard/SubjectCard";
import CreateNew from "../../components/CreateNew/CreateNew";
import WebcamDisplay from "../../react3/WebcamDisplay";

const Home = () => {
    const [chats, setChats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch('http://localhost:8005/get-card');
                if (!response.ok) {
                    throw new Error('Failed to fetch chats');
                }
                const data = await response.json();
                setChats(data.cards || []); // Assuming the API returns the same structure as data.json
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleCardClick = (category) => {
        window.location.href = `/chat/${category.toLowerCase()}`;
    };

    return (
        <div>
            <header className="header">
                <h1 className="logo">NextGenTutor</h1>
            </header>

            <main className="main">
                <h2 className="main-heading">
                    Hey! Go through your classes with our virtual tutor
                </h2>
                <h3 className="sub-heading">Previously Created Chats</h3>

                {isLoading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4">{error}</div>
                ) : (
                    <div className="cards-grid">
                        {chats.map((chat, index) => (
                            <SubjectCard key={index} {...chat} onCardClick={handleCardClick} />
                        ))}
                    </div>
                )}

                <button onClick={() => setIsModalOpen(true)} className="create-button">
                    <Plus size={20} />
                    Create New
                </button>

                <CreateNew
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(data) => console.log(data)}
                />
            </main>
            {/* <WebcamDisplay/> */}
        </div>
    );
};

export default Home;