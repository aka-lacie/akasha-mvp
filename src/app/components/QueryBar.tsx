import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'

interface QueryBarProps {
    handleQuery: (query: string) => void;
  }

const QueryBar: React.FC<QueryBarProps> = ({ handleQuery }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(query.trim()) {
            handleQuery(query);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Control
                className="text-black"
                type="text"
                placeholder="Search the Irminsul..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit">Ask Akasha</Button>
        </Form>
    );
};

export default QueryBar;

