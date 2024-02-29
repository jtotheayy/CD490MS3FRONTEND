// Jay Santamaria CS 490 02/08/2024
// Individual Project

import React, { useState, useEffect } from 'react';

function CustomersPage() {
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchID, setSearchID] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerID, setCustomerID] = useState('');
    const [showRentModal, setShowRentModal] = useState(false);
    const [updateFirstName, setUpdateFirstName] = useState('');
    const [updateLastName, setUpdateLastName] = useState('');
    const [updateEmail, setUpdateEmail] = useState('');
    const [updateActive, setUpdateActive] = useState('');

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const fetchCustomers = async (page = currentPage) => {

        try {
            const response = await fetch(`/api/customers?page=${page}`);
            const data = await response.json();
            setCustomers(data);

            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            // Update filteredCustomers with the data for the current page
            setFilteredCustomers(data.slice(startIndex, endIndex));

        } catch (error) {
            console.error("Error fetching Customers:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handlePageChange = async (newPage) => {
        if (newPage > 0) {
            setCurrentPage(newPage);
            try {
                const response = await fetch(`/api/customers?page=${newPage}`);
                const data = await response.json();

                setCustomers(data);
                setFilteredCustomers(data.slice(0, pageSize));

            } catch (error) {
                console.error("Error fetching Customers:", error);
            }
        }
    };

    const handleNextPage = () => {
        handlePageChange(currentPage + 1);

    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };


    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newStoreId, setNewStoreId] = useState('');
    const [newCustomerId, setNewCustomerId] = useState('');

    const handleAddCustomer = async () => {
        if (!newFirstName || !newLastName || !newEmail || !newStoreId || !newCustomerId) {
            alert("Please fill in all the required fields.");
            return;
        }

        try {
            const response = await fetch("/api/customers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: newFirstName,
                    last_name: newLastName,
                    email: newEmail,
                    store_id: newStoreId,
                    customer_id: newCustomerId,
                }),
            });

            if (response.ok) {
  
                setShowAddModal(false);
                setNewFirstName('');
                setNewLastName('');
                setNewEmail('');
                setNewStoreId('');
                setNewCustomerId('');
            } else {
                console.error('Failed to add customer');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };



    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        try {
            let url = "/api/customers?";
    
            if (searchFirstName) {
                url += `first_name=${encodeURIComponent(searchFirstName)}`;
            }
    
            if (searchLastName) {
                url += `${searchFirstName ? '&' : ''}last_name=${encodeURIComponent(searchLastName)}`;
            }
    
            if (searchID) {
                url += `${searchFirstName || searchLastName ? '&' : ''}customer_id=${encodeURIComponent(searchID)}`;
            }
    
            const response = await fetch(url);
            const data = await response.json();
    
            setFilteredCustomers(data);
    
        } catch (error) {
            console.error("Error searching customers:", error);
        }
    };
    

    const handleCheckAvailability = (customer) => {
        setSelectedCustomer(customer);
        setShowRentModal(true);
    };



    const handleUpdateCustomer = async () => {
        if (!updateFirstName || !updateLastName || !updateEmail || updateActive === undefined) {
            alert("Please fill in all the required fields.");
            return;
        }

        const confirmUpdate = window.confirm("Are you sure you want to update this customer?");

        if (confirmUpdate) {
            try {

                const response = await fetch(`/api/customers/${selectedCustomer.customer_id}`, {
                    method: 'PUT',  
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: updateFirstName,
                        last_name: updateLastName,
                        email: updateEmail,
                        active: updateActive,
                    }),
                });

                if (response.ok) {

                    setShowRentModal(false);
                    setUpdateFirstName('');
                    setUpdateLastName('');
                    setUpdateEmail('');
                    setUpdateActive('');
                } else {
                    console.error('Failed to update customer');
                }
            } catch (error) {
                console.error('Error updating customer:', error);
            }
        }
    };





    const handleDeleteCustomer = async (customer) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer? " + customer.first_name);

        if (confirmDelete) {
            try {
                const response = await fetch(`/api/customers/${customer.customer_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setShowDeleteConfirmation(false);
                } else {
                    console.error('Failed to delete customer');
                }
            } catch (error) {
                console.error("Error deleting customer:", error);
            }
        } else {
            setShowDeleteConfirmation(false);
        }
    };

    const [showRentalHistoryModal, setShowRentalHistoryModal] = useState(false);
    const [rentalHistory, setRentalHistory] = useState([]);

    // Function to fetch rental history
    const fetchRentalHistory = async (customerId) => {
        setCustomerID(customerId);

        try {
            const response = await fetch(`/api/customers/${customerId}/rental-history`);
            if (response.ok) {
                const data = await response.json();
                setRentalHistory(data);
                setShowRentalHistoryModal(true);  // Move this line here
            } else {
                console.error('Failed to fetch rental history');
            }
        } catch (error) {
            console.error('Error fetching rental history:', error);
        }
    };

    const handleReturnMovie = async (rentalId) => {
        try {
            const response = await fetch(`/api/return/${rentalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("Movie returned successfully!");
                fetchRentalHistory(customerID);
            } else {
                const data = await response.json();
                alert(`Error returning movie: ${data.error}`);
            }
        } catch (error) {
            console.error("Error returning movie:", error);
            alert("Error returning movie. Please try again.");
        }
    };

    return (
        <div className="search">
            <br></br>
            <button onClick={() => setShowAddModal(true)}>Add New Customer</button>

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowAddModal(false)}>&times;</span>
                        <h2>Add New Customer</h2>
                        <label htmlFor="newFirstName">First Name:</label>
                        <input type="text" id="newFirstName" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                        <br></br>
                        <label htmlFor="newLastName">Last Name:</label>
                        <input type="text" id="newLastName" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                        <br></br>

                        <label htmlFor="newEmail">Email:</label>
                        <input type="text" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <br></br>

                        <label htmlFor="newStoreId">Store ID:</label>
                        <input type="text" id="newStoreId" value={newStoreId} onChange={(e) => setNewStoreId(e.target.value)} />
                        <br></br>
                        <label htmlFor="newCustomerId">Customer ID:</label>
                        <input type="text" id="newCustomerId" value={newCustomerId} onChange={(e) => setNewCustomerId(e.target.value)} />
                        <br></br>

                        <button onClick={handleAddCustomer}>Add Customer</button>
                    </div>
                </div>
            )}

            <h1>Customers</h1>
            <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchFirstName} onChange={(e) => setSearchFirstName(e.target.value)} placeholder="Search customers by First Name..." />
                <input type="text" value={searchLastName} onChange={(e) => setSearchLastName(e.target.value)} placeholder="Search customers by Last Name..." />
                <input type="text" value={searchID} onChange={(e) => setSearchID(e.target.value)} placeholder="Search customers by ID..." />
                <button type="submit">Search</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Rental History</th>

                        <th>Customer</th>
                        <th>Store ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Active</th>
                        <th>Create date</th>
                        <th>Customer ID</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => (

                        <tr key={customer.id}>
                            <td>
                                <button onClick={() => fetchRentalHistory(customer.customer_id)}>
                                    Rental History
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleCheckAvailability(customer)}>
                                    {customer.first_name} {customer.last_name}
                                </button>
                            </td>
                            <td>{customer.store_id}</td>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.active}</td>
                            <td>{customer.create_date}</td>
                            <td>{customer.customer_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {showRentModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowRentModal(false)}>&times;</span>

                        <h2>Customer Details</h2>
                        <p>Name: {selectedCustomer && `${selectedCustomer.first_name} ${selectedCustomer.last_name}`}</p>
                        <p>Email: {selectedCustomer && selectedCustomer.email}</p>
                        <p>ID: {selectedCustomer && selectedCustomer.customer_id}</p>

                        <label htmlFor="updateFirstName">Update First Name:</label>
                        <input type="text" id="updateFirstName" value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value)} />
                        <br></br>
                        <label htmlFor="updateLastName">Update Last Name:</label>
                        <input type="text" id="updateLastName" value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value)} />
                        <br></br>
                        <label htmlFor="updateEmail">Update Email:</label>
                        <input type="text" id="updateEmail" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
                        <br></br>
                        <label htmlFor="updateActive">Active:</label>
                        <input type="text" id="updateActive" value={updateActive} onChange={(e) => setUpdateActive(e.target.value)} />
                        <br></br>

                        <button onClick={handleUpdateCustomer}>Update</button>
                        <button onClick={() => handleDeleteCustomer(selectedCustomer)}>Delete</button>

                    </div>
                </div>
            )}


            {showRentalHistoryModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowRentalHistoryModal(false)}>
                            &times;
                        </span>

                        <h2>Rental History</h2>
                        <h3>Customer: {customerID}</h3>
                        <table>
                            <tbody>
                                {rentalHistory.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Rental ID</th>
                                                <th>Film</th>
                                                <th>Return Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rentalHistory.map((rental) => (
                                                <tr key={rental.rental_id}>
                                                    <td>{rental.rental_id}</td>
                                                    <td>{rental.title}</td>
                                                    <td>{rental.return_date ? 'Returned' : 'Not Returned'}</td>
                                                    <td>
                                                        {!rental.return_date && (
                                                            <button onClick={() => handleReturnMovie(rental.rental_id)}>
                                                                Return Movie
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No rental history found for the customer.</p>
                                )}
                            </tbody>
                        </table>
                    </div>


                </div>
            )}
            <div className="pagination">
                <button onClick={handlePrevPage}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
}

export default CustomersPage;
