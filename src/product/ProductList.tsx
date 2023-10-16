import React, { ChangeEvent, useState, CSSProperties } from 'react';
import Papa from 'papaparse';
import { Box, H1 } from '@bigcommerce/big-design';
import { Button, Stack, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimesCircle, faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import './ProductStyle.css';
import { createProduct } from '../services/ProductServices'
import ClipLoader from "react-spinners/ClipLoader";
import { number, object } from 'yup';
import { itemMap } from './ProductAddFormType';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
interface Productlist {
    headers: [];
    parsedData: { Brand: string; Sku: string; }[];
    setFormSubmitted: (value: boolean) => void;
    formData: {
        environment: string;
        type: string;
        category: string;
        filter: string;
        images: boolean;
        keywords: boolean;
        inventory: boolean;
    };
}


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    position: "absolute",
    zIndex: 9999,
    top: "50%",
    left: "50%",
    background: "#00000082 !important",
    transform: "translate(-50%, -50%)"
};
export const ProductList: React.FC<Productlist> = ({ headers, parsedData, setFormSubmitted, formData }) => {
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadStarted, setUploadStarted] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    let [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [continueFunction, setContinueFunction] = useState<(() => void) | null>(null);
    // Define the columns to exclude even if they are empty
    const excludedColumns = [
        "Product URL",
        "Product Image File - 2",
        "Product Image File - 3",
        "Product Image File - 4",
        "Product Image File - 5",
        "Product Image File - 6",
        "Product Image File - 7"
    ];

    // Filter out empty column names
    const emptyColumnNames = headers.filter((header) =>
        parsedData.some((row) => !row[header] && !excludedColumns.includes(header))
    );

    // Filter out empty rows, excluding those with only excluded columns
    const emptyRows = parsedData.filter((row) =>
        headers.some(
            (header) =>
                !row[header] && !excludedColumns.includes(header)
        )
    );

    const handleModalSaveChanges = () => {
        setShowModal(false);
        const customInvalidRowCount = 0;
        handleStartUpload(customInvalidRowCount);
    };

    const handleModalCancelChanges = () => {
        setShowModal(false);
        setFormSubmitted(false);
    };
    
    const rowCount = parsedData.length;
    const invalidRowCount = emptyRows.length;
    const totalErrors = 0;
    const itemMap: itemMap[] = [];
    const handleStartUpload = async (invalidRowCount: number) => {
        if (invalidRowCount > 0) {
            setModalMessage('Some errors have been detected. Are you sure you want to proceed?');
            setContinueFunction(() => handleModalSaveChanges);
            setShowModal(true); // Show the modal
            return; // Don't proceed with the upload
        }
        setLoading(true);
        setUploadStarted(true);
        setUploadError(null);
        setSuccessMessage(null);

        const successMessages: string[] = [];
        const errorMessages: string[] = [];
        parsedData.map((item: any) => {
            itemMap.push({
                "name": item['Product Name'],
                "sku": item['Product Code/SKU'],
                "brand": item['Brand'],
                "beautyCopy": item['Beauty Copy'],
                "category": item["Category"],
                "color": item["Color"],
                "costPrice": item["Cost Price"],
                "gender": item["Gender"],
                "colorHexValue": item["Hex Value"],
                "Inventory": item["inventory"],
                "metaDescription": item["Meta Description"],
                "productFeatureCopy": item["Product Feature Copy"],
                "productImageFile1": item["Product Image File - 1"],
                "productImageFile2": item["Product Image File - 2"],
                "productImageFile3": item["Product Image File - 3"],
                "productImageFile4": item["Product Image File - 4"],
                "productImageFile5": item["Product Image File - 5"],
                "productImageFile6": item["Product Image File - 6"],
                "productImageFile7": item["Product Image File - 7"],
                "productUrl": item["Product URL"],
                "retailPrice": item["Retail Price"],
                "rptCategory": item["RptCategory"],
                "rptFamily": item["RptFamily"],
                "rptProfitCenter": item["RptProfitCenter"],
                "rptSAPL5": item["RptSAPL5"],
                "shadeFamily": item["Shade Family"],
                "size": item["Size"],
                "sizeFitting": item["Size Fitting"],
                "taxCode": item["Tax Code"]
            })
        })
        for (let i = 0; i < itemMap.length; i++) {
            const data = {
                product: [itemMap[i]],
                "type": formData.type,
                "filter": formData.filter,
                "source": formData.environment,
                "images": formData.images,
                "keywords": formData.keywords,
                "inventory": formData.inventory,
            }
            setLoadingMessage('Creating Product '+ itemMap[i]['sku']+ ' ...');
            try {
                const res = await createProduct(data);
                console.log(res.data);
    
                if (res.data[0]['product'] == null) {
                    errorMessages.push('<p>' + 'Error creating product' + '</p>');
                } else if (res.data[0]['product']['errors'] == undefined) {
                    successMessages.push('<p>' + res.data[0]['product']['sku'] + ' Created successfully </p>');
                } else if (res.data[0]['product']['errors']['status'] === 200) {
                    successMessages.push('<p>' + res.data[0]['product']['sku'] + ' Created successfully </p>');
                } else {
                    errorMessages.push('<p>' + res.data[0]['product']['sku'] + ' ' + res.data[0]['product']['errors']['title'] + ' ' + JSON.stringify(res.data[0]['product']['errors']['errors']) + '</p>');
                }
            } catch (error) {
                console.error(error); // Handle any potential errors in the API call
                errorMessages.push('<p>Error creating product</p>');
            }
            setSuccessMessage(successMessages.join(''));
            setUploadError(errorMessages.join(''));
        }
        setLoading(false);
    };

    const handleCancelUpload = async () => {
        setModalMessage('Are you sure you want to abort the process?');
        setContinueFunction(() => handleModalCancelChanges);
        setShowModal(true); // Show the modal
    };
    return (
        <div className='productListContainer'>
            <ClipLoader
                color="#36a1d6"
                loading={loading}
                cssOverride={override}
                size={100}
            />
            {parsedData.length > 0 && (<div>
                <Card>
                    <Card.Header><Card.Title>Product List</Card.Title></Card.Header>
                    <Card.Header><Card.Subtitle className="mb-2 text-muted">Showing results of uploaded records</Card.Subtitle></Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    {headers.map((header: any) => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.slice(0, 5).map((row: any, index: number) => (
                                    <tr key={index}>
                                        {headers.map((header: any) => (
                                            <td key={header}>{row[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </div>)}
            <br />
            {uploadStarted ? null : (
                <Card>
                    <Card.Header>
                        Validation Results
                    </Card.Header>
                    <Card.Body>
                        {parsedData.length > 0 ? (
                            <Alert variant="warning">
                                <FontAwesomeIcon icon={faInfoCircle} /> Checked rows: {rowCount}, Invalid rows: {invalidRowCount}; Total errors: 0
                            </Alert>
                        ) : (
                            <Alert variant="warning">
                                <FontAwesomeIcon icon={faInfoCircle} /> Either there are no matching records or no records available for upload.
                            </Alert>
                        )}
                        {parsedData.length > 0 && (
                            invalidRowCount > 0 ? (

                                <Alert variant="danger">
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                        <Card>
                                            <Card.Header>Empty Rows</Card.Header>
                                            <Card.Body>
                                                <p>The following columns have empty values:</p>
                                                {emptyColumnNames.length > 0 ? (
                        
                                                <>{emptyRows.map((row, index) => (
                                                    <div key={index}>
                                                        <p>Row {index + 1} - {Object.keys(row).filter(header => !row[header] && !excludedColumns.includes(header)).join(', ')}</p>
                                                    </div>
                                                ))}</>): null }
                                                
                                            </Card.Body>
                                        </Card>
                                    </p>
                                </Alert>
                            ) : (
                                <Alert variant="success">
                                    <Alert.Heading>Sucess</Alert.Heading>
                                    <p><FontAwesomeIcon icon={faCheck} />  File is valid! To start import process press "Upload" button</p>
                                </Alert>
                            ))}
                    </Card.Body>
                </Card>
            )}
            {loading ? (
            <Card>
                <Card.Body>
                    <Alert variant="warning">
                        <Alert.Heading></Alert.Heading>
                        <ProgressBar now={70} variant="success" animated label={loadingMessage} className="custom-progress-bar"/>
                    </Alert>
                </Card.Body>
            </Card>
            ) : null}
            <br />
            {uploadStarted && uploadError ? (
                <Card>
                    <Card.Header>
                        API Response - Errors
                    </Card.Header>
                    <Card.Body>
                        <Alert variant="danger">
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <div dangerouslySetInnerHTML={{ __html: uploadError }} />
                        </Alert>
                    </Card.Body>
                </Card>
            ) : null}
            {uploadStarted && successMessage ? (
                <Card>
                    <Card.Header>
                        API Response - Success
                    </Card.Header>
                    <Card.Body>
                        <Alert variant="success">
                            <Alert.Heading>Success</Alert.Heading>
                            <div dangerouslySetInnerHTML={{ __html: successMessage }} />
                        </Alert>
                    </Card.Body>
                </Card>
            ) : null}
            <br />
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-center">
                        <Stack direction="horizontal" gap={4}>
                        {!loading && parsedData.length > 0 && (
                            <Button as="a" variant="success" size="lg" onClick={() => handleStartUpload(invalidRowCount)}>
                                Start Upload <FontAwesomeIcon icon={faUpload} />
                            </Button>
                        )}
                            <Button as="a" variant="warning" size="lg" onClick={() => handleCancelUpload()}>
                                Cancel Upload <FontAwesomeIcon icon={faTimesCircle} />
                            </Button>
                        </Stack>
                    </div>
                </Card.Body>
            </Card>
            <br />
            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={continueFunction ?? (() => {})}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


