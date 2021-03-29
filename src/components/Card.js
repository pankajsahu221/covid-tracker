import React from 'react'
import NumberFormat from 'react-number-format';

function Card({ title, num }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p><NumberFormat value={num} displayType="text" thousandSeparator={true}/></p>
            <span className="hor-line"></span>
        </div>
    )
}

export default Card
