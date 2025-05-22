import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaPlus, FaDownload, FaTrash, FaSpinner } from 'react-icons/fa';
import { internReportService } from '../../services/api';
import '../../styles/common.css';

const InternReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const reportsPerPage = 10;
    const userRole = localStorage.getItem('user_role');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login-staff');
            return;
        }

        const fetchReports = async () => {
            try {
                const response = await internReportService.getAllInternReports();
                setReports(response.data || []);
                setFilteredReports(response.data || []);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des rapports de stage');
                setLoading(false);
            }
        };

        fetchReports();
    }, [navigate]);

    useEffect(() => {
        const filtered = (reports || []).filter(report => 
            report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.intern?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReports(filtered);
        setCurrentPage(1);
    }, [searchTerm, reports]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport de stage ?')) {
            setIsDeleting(true);
            try {
                await internReportService.deleteInternReport(id);
                setReports(prevReports => prevReports.filter(report => report.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression du rapport de stage');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleDownload = async (id) => {
        setIsDownloading(true);
        try {
            const response = await internReportService.downloadInternReport(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rapport-stage-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Erreur lors du téléchargement du rapport');
        } finally {
            setIsDownloading(false);
        }
    };

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = (filteredReports || []).slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil((filteredReports || []).length / reportsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'badge-info';
            case 'pending': return 'badge-warning';
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loading-spinner">
                    <FaSpinner className="h-12 w-12 text-primary-color" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="alert alert-error">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card p-6">
                <div className="page-header">
                    <h2 className="page-title">Rapports de Stage</h2>
                    <p className="page-description">Gérez et consultez les rapports de stage des stagiaires</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="search-container">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher un rapport..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/dashboard/${userRole}/intern-reports/create`)}
                        className="btn btn-primary"
                    >
                        <FaPlus className="mr-2" />
                        Nouveau rapport
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Stagiaire</th>
                                <th>Date de soumission</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.map((report) => (
                                <tr key={report.id}>
                                    <td>
                                        <div className="font-medium text-gray-900">{report.title}</div>
                                        <div className="text-sm text-gray-500">{report.description}</div>
                                    </td>
                                    <td className="text-gray-900">{report.intern?.name}</td>
                                    <td className="text-gray-500">
                                        {new Date(report.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => navigate(`/dashboard/${userRole}/intern-reports/${report.id}`)}
                                                className="text-primary-color hover:text-primary-hover"
                                            >
                                                Voir
                                            </button>
                                            <button
                                                onClick={() => handleDownload(report.id)}
                                                className="text-success-color hover:text-success-hover"
                                                disabled={isDownloading}
                                            >
                                                {isDownloading ? (
                                                    <FaSpinner className="loading-spinner h-4 w-4" />
                                                ) : (
                                                    <FaDownload />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="text-danger-color hover:text-danger-hover"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <FaSpinner className="loading-spinner h-4 w-4" />
                                                ) : (
                                                    <FaTrash />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReports.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Aucun rapport de stage trouvé
                    </div>
                )}

                {filteredReports.length > 0 && (
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            <FaChevronLeft />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternReportList; 