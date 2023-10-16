import { render, fireEvent, waitFor, debug } from '@testing-library/react';
import FileUpload from './FileUpload';

describe('FileUpload', () => {
    it('should display the selected file name', async () => {
        const { getByTestId } = render(<FileUpload />);

        const fileInput = getByTestId('file-input');
        const file = new File(['test file content'], 'test.jpg', {
            type: 'image/jpeg',
        });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const fileName = getByTestId('file-name');
        expect(fileName.textContent).toBe('test.jpg');
    });

    it('should not display the selected file name and not call the onSubmit function when the file is not JPEG', async () => {
        const onSubmit = jest.fn();
        const { getByTestId } = render(<FileUpload onSubmit={onSubmit} />);

        const fileInput = getByTestId('file-input');
        const file = new File(['test file content'], 'test.txt', {
            type: 'text/plain',
        });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = getByTestId('submit-button');
        fireEvent.click(submitButton);

        const fileName = getByTestId('file-name');
        expect(fileName).toBe(null);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should call the onSubmit function when the form is submitted', async () => {
        const onSubmit = jest.fn();
        const { getByTestId } = render(<FileUpload onSubmit={onSubmit} />);

        const fileInput = getByTestId('file-input');
        const file = new File(['test file content'], 'test.jpg', {
            type: 'image/jpeg',
        });
        // fireEvent.change(file
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = getByTestId('submit-button');
        fireEvent.click(submitButton);

        expect(onSubmit).toHaveBeenCalled();
        debug()
    });
});
