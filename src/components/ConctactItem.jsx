import React from 'react';

const ContactItem = ({ contacto, toggleSeleccion }) => {
    const { id, nombre, correo, telefono, seleccionado } = contacto;

    const cambiarSeleccion = () => {
        toggleSeleccion(id); 
    };

    return (
        <div className="contact-card">
            <div className="contact-info">
                <h5>{nombre}</h5>
                <p>{correo}</p>
                <p>{telefono}</p>
            </div>
            <input 
                type="checkbox" 
                className="form-check-input" 
                checked={seleccionado} 
                onChange={cambiarSeleccion} 
            />
        </div>
    );
};

export default ContactItem;
