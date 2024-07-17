import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const ContactList = () => {
    const [contactos, setContactos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [contactosSeleccionados, setContactosSeleccionados] = useState([]);
    const [contactoEnEdicion, setContactoEnEdicion] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('asc'); 

    const nombreRef = useRef();
    const correoRef = useRef();
    const telefonoRef = useRef();

    //  para agregar un nuevo contacto
    const agregarContacto = () => {
        const nombre = nombreRef.current.value.trim();
        const correo = correoRef.current.value.trim();
        const telefono = telefonoRef.current.value.trim();

        if (nombre === "" || correo === "" || telefono === "") return;

        const nuevoContacto = {
            id: uuidv4(),
            nombre: nombre,
            correo: correo,
            telefono: telefono
        };

        setContactos(prevContactos => [...prevContactos, nuevoContacto]);

        // Limpiar campos de entrada
        nombreRef.current.value = "";
        correoRef.current.value = "";
        telefonoRef.current.value = "";

        
        setShowModal(false);
    };

    //  para eliminar un contacto por ID
    const eliminarContacto = (id) => {
        const nuevosContactos = contactos.filter(contacto => contacto.id !== id);
        setContactos(nuevosContactos);
    };

    //  para seleccionar/deseleccionar un contacto por ID
    const toggleSeleccionContacto = (id) => {
        if (contactosSeleccionados.includes(id)) {
            setContactosSeleccionados(contactosSeleccionados.filter(item => item !== id));
        } else {
            setContactosSeleccionados([...contactosSeleccionados, id]);
        }
    };

    //  para abrir el modal de edición de un contacto
    const editarContacto = (contacto) => {
        setContactoEnEdicion(contacto);
        setShowModal(true);
    };

    //  para actualizar un contacto editado
    const actualizarContacto = () => {
        setContactos(contactos.map(c => (c.id === contactoEnEdicion.id ? contactoEnEdicion : c)));
        setContactoEnEdicion(null);
        setShowModal(false);
    };

    // para contar la cantidad de contactos activos
    const contarContactosActivos = () => contactos.length;

    //  para mostrar un resumen de la cantidad de contactos
    const ResumenContactos = () => {
        const cantidad = contarContactosActivos();
        if (cantidad === 0) {
            return (
                <div className='alert alert-success mt-3 text-center'>
                    No tienes contactos agregados
                </div>
            );
        }
        if (cantidad === 1) {
            return (
                <div className='alert alert-info mt-3 text-center'>
                    Tienes {cantidad} contacto agregado
                </div>
            );
        }
        if (cantidad > 9) {
            return (
                <div className='alert alert-danger mt-3 text-center'>
                    Tienes {cantidad} contactos agregados, son muchos
                </div>
            );
        }
        return (
            <div className='alert alert-warning mt-3 text-center'>
                Tienes {cantidad} contactos agregados
            </div>
        );
    };

    // Clave para el almacenamiento local de los contactos
    const KEY = "contactos";

    // Cargar contactos almacenados desde localStorage al inicio
    useEffect(() => {
        const contactosAlmacenados = JSON.parse(localStorage.getItem(KEY));
        if (contactosAlmacenados) {
            setContactos(contactosAlmacenados);
        }
    }, []);

    // Guardar contactos en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(contactos));
    }, [contactos]);

    // Función para cambiar la página actual
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Cálculo de índices para la paginación
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;

    // Filtrar, ordenar y paginar los contactos actuales
    const currentContacts = contactos
        .filter(contacto => contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const nameA = a.nombre.toLowerCase();
            const nameB = b.nombre.toLowerCase();
            return sortType === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        })
        .slice(indexOfFirstContact, indexOfLastContact);

    return (
        <Fragment>
            <h1 className="display-5 my-3 text-center">Directorio de Contactos 📞</h1>

            <div className="input-group my-3 justify-content-center">
                <input
                    className="form-control"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="input-group mb-3 justify-content-center">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => setSortType(sortType === 'asc' ? 'desc' : 'asc')}
                >
                    Ordenar {sortType === 'asc' ? 'ascendente' : 'descendente'}
                </button>
            </div>

            <div className="input-group my-5 justify-content-center">
                <input className="form-control" placeholder="Nombre" ref={nombreRef} />
                <input className="form-control mx-2" placeholder="Correo electrónico" ref={correoRef} />
                <input className="form-control mx-2" placeholder="Teléfono" ref={telefonoRef} />
                <button className="btn btn-primary mx-2" onClick={agregarContacto}>
                    Agregar Contacto
                </button>
            </div>

            <div className="row justify-content-center">
                {currentContacts.map((contacto) => (
                    <div className="col-md-4 mb-4" key={contacto.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{contacto.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{contacto.telefono}</Card.Subtitle>
                                <Card.Text>{contacto.correo}</Card.Text>
                                <Button variant="primary" onClick={() => editarContacto(contacto)}>Editar</Button>
                                <Button variant="danger" className="ml-2" onClick={() => eliminarContacto(contacto.id)}>Eliminar</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            <ResumenContactos />

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setContactoEnEdicion(null);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={contactoEnEdicion?.nombre}
                                onChange={(e) => setContactoEnEdicion({ ...contactoEnEdicion, nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={contactoEnEdicion?.correo}
                                onChange={(e) => setContactoEnEdicion({ ...contactoEnEdicion, correo: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                value={contactoEnEdicion?.telefono}
                                onChange={(e) => setContactoEnEdicion({ ...contactoEnEdicion, telefono: e.target.value })}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false);
                        setContactoEnEdicion(null);
                    }}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={actualizarContacto}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            <nav className="pagination justify-content-center">
                <ul className="pagination">
                    {contactos.length > contactsPerPage && (
                        Array.from({ length: Math.ceil(contactos.length / contactsPerPage) }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                            </li>
                        ))
                    )}
                </ul>
            </nav>
        </Fragment>
    );
};

export default ContactList;
