import React from 'react'
import "./SubjectCard.css"
import Chat from "../../assets/Chat.png"

const SubjectCard = ({ title, description, category, onCardClick }) => {
    return (
        <div className="subject-card">
            <div>
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>
            <div>
                <span className="card-category">{category}</span>
                <button
                    onClick={() => onCardClick(category.toLowerCase())}
                    className="view-button"
                >
                    <img src={Chat} alt="chat" className='chat'/>
                </button>
            </div>
        </div>
    )
}

export default SubjectCard