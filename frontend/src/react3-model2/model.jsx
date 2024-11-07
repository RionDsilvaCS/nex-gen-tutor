import React from 'react'
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from './experience';
import { useChat } from "../react3/hooks/useChat";
import Chat from "../components/ChatApp/ChatApp"
import "./model.css"

const main = () => {

    const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

    return (
        <div className='body'>
            <Loader />
            <Leva/>
            <div class="bg-animation">
                <div id="stars"></div>
                <div id="stars2"></div>
            </div>
            <div className="left">
                <Canvas shadows camera={{ position: [0, 0, 1], fov: 40 }}>
                    <Experience />
                </Canvas>
            </div>
            <div className="right">
                <Chat />
            </div>
            <div className="camera">
                <button
                    onClick={() => setCameraZoomed(!cameraZoomed)}
                    className="camera-button"
                >
                    {cameraZoomed ? (
                        <img src="https://cdn-icons-png.flaticon.com/128/17446/17446013.png" alt="Zoom In" />
                    ) : (
                        <img src="https://cdn-icons-png.flaticon.com/128/17446/17446016.png" alt="Zoom Out" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default main