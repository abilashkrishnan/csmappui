import React, { useState } from 'react';

interface Props {
    onSubmit: (file: File) => void;
}
const FileUpload: React.FC<Props> = ({ onSubmit }) => {
    const [file, setFile] = useState<File | null>(null);
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'image/jpeg') {
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(file){
            onSubmit(file);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="file"
                accept="image/jpeg"
                onChange={handleFileSelect}
                data-testid="file-input"
            />
            {file && <p data-testid="file-name">{file.name}</p>}
            <button type="submit" data-testid="submit-button">
                Upload
            </button>
        </form>
    );
};
export default FileUpload;
