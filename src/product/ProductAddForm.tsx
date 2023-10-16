import React, { ChangeEvent, useState, CSSProperties } from 'react';
import { Form, FormGroup, Button, InputGroup, Card, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import Papa from 'papaparse';
import * as Yup from 'yup';
import { Product } from './ProductAddFormType';
import { ProductList } from './ProductList';
import ClipLoader from "react-spinners/ClipLoader";
import './ProductStyle.css';
import {createProduct} from '../services/ProductServices'
// const initialValues: Product = {
//     csvfile: '',
//     name: '',
//     category: '',
//     type: '',
//     environment: '',
//     filter: '',
// };


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
const validationSchema = Yup.object().shape({
    environment: Yup.string().required('Environment is required'),
    category: Yup.string().required('Category is required'),
    type: Yup.string().required('Type is required'),
});

export const ProductAddForm: React.FC<Product> = () => {

    const [parsedData, setParsedData] = useState<Array<any>>([]);
    const [headers, setHeaders] = useState<Array<string>>([]);
    const [csvFile, setCsvFile] = useState<Array<string>>([]);
    let [loading, setLoading] = useState(false);
    const [images, setImages] = useState(false);
    const [keywords, setKeywords] = useState(false);
    const [inventory, setInventory] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState<Array<any>>([]);
    //file changing 
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('Selected file:', file); // Add this line for debugging
        setCsvFile(file);
    };

    const { errors, handleChange, handleSubmit, resetForm, touched, values,handleBlur } = useFormik({
        initialValues: {
            environment: '',
            type: '',
            category: '',
            filter: '',
            csvfile: undefined,
        },
        validationSchema,
        onSubmit: values => {
            setLoading(true);
            //CSv parsed function
            const formData = {
                environment: values.environment,
                type: values.type,
                category: values.category,
                filter: values.filter,
                images: images,
                keywords: keywords,
                inventory: inventory,
            };
            if (csvFile.length === 0) {
                alert('Plase select the csv file');
                setLoading(false);
            } else {
                setTimeout(
                    () => onClickFileUpload(csvFile, formData),
                    3000
                );
                resetForm();
            }
        },
    });

    //File parse
    const onClickFileUpload = (file: any, formData: any) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const result = e.target.result as string;
                    const parsed = Papa.parse(result, { header: true });
                    const newData = parsed.data;
                    const sku = formData.filter;
                    // Check if SKU is not empty
                    if (sku) {
                        const skuArray = sku.split(',').map(s => s.trim());
                        const filteredData = newData.filter((row: any) => skuArray.includes(row['Product Code/SKU']));
                        setParsedData(filteredData);
                    } else {
                        const parsedNewdata = newData.slice(0, -1);
                        setParsedData(parsedNewdata);
                    }
                    setHeaders(Object.keys(parsed.data[0]));
                    setFormData(formData);         
                }
            };

            reader.readAsText(file);
        }
        setLoading(false);
        setFormSubmitted(true);
    }

    return (

        <div className="sweet-loading">
            <ClipLoader
                color="#36a1d6"
                loading={loading}
                cssOverride={override}
                size={100}
            />
            {formSubmitted ? (
                <div>
                    <ProductList parsedData={parsedData} headers={headers} setFormSubmitted={setFormSubmitted} formData={formData}/>
                </div>
            ) : (
                <div className='productform'>
                    <Card>
                        <Card.Header>
                            <Card.Title>Product Load/Migration</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Form.Label>Environment</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        as="select"
                                        name="environment"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.environment}
                                        isInvalid={touched.environment && errors.environment ? true: undefined}
                                        
                                    >
                                        <option value="" disabled>Select an environment</option>
                                        <option value="dev">DEV</option>
                                        <option value="qa">QA</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.environment}</Form.Control.Feedback>
                                </FormGroup>
                                <br />
                                <FormGroup>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        size="lg"
                                        name="category"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.category}
                                        isInvalid={touched.category && errors.category ? true: undefined}
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="Products">Products</option>
                                        <option value="Category" disabled>Category</option>
                                        <option value="Brands" disabled>Brands</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                                </FormGroup>
                                <br />
                                <FormGroup>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        as="select"
                                        name="type"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.type}
                                        isInvalid={touched.type && errors.type ? true: undefined}
                                    >
                                        <option value="" disabled>Select a Type</option>
                                        <option value="vintage">Vintage</option>
                                        <option value="collections">Collections</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                                </FormGroup>
                                <br />
                                <FormGroup>
                                    <Form.Label>Filter</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            size="lg"
                                            type="text"
                                            name="filter"
                                            placeholder="Add multiple SKU separated by comma JUL23_001,JUL23_002"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.filter}
                                        />
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">{errors.filter}</Form.Control.Feedback>
                                </FormGroup>
                                <br />
                                <FormGroup>
                                    <Form.Check
                                        type="checkbox"
                                        label="Images"
                                        checked={images}
                                        onChange={(e) => setImages(e.target.checked)}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Keywords"
                                        checked={keywords}
                                        onChange={(e) => setKeywords(e.target.checked)}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Inventory"
                                        checked={inventory}
                                        onChange={(e) => setInventory(e.target.checked)}
                                    />
                                </FormGroup>
                                <br />
                                <FormGroup>
                                    <Form.Label>CSV File</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        name="csvfile"
                                        type="file"
                                        accept=".csv"
                                        onChange={event => handleFileChange(event)}
                                        isInvalid={!!errors.csvfile}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.csvfile}</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup className='buttonContainer'>
                                    <Button size="lg" className="uploadButton" type="submit">UPLOAD</Button>
                                </FormGroup>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
}