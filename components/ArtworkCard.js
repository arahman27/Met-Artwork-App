import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useSWR from 'swr';
import Error from 'next/error';
import Link from 'next/link';

export default function ArtworkCard(prop) {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: result, error } = useSWR(
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + prop.objectID,
        fetcher

    );

    if(error){
        return <Error statusCode={404}/>

    }

    if(!result){
        return null;
    
    }

    const redirectRef = "/artwork/" + result.objectID;

    return (
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={result.primaryImageSmall? result.primaryImageSmall : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"} />
        <Card.Body>
            <Card.Title>{result.title? result.title : "N/A"}</Card.Title>
            <Card.Text>
                {result.objectDate? result.objectDate : "N/A "}&nbsp;
                {result.classification? result.classification : "N/A "}&nbsp;
                {result.medium? result.medium : "N/A "}&nbsp;
                <Link href={redirectRef} passHref><Button variant="primary">{result.objectID}</Button></Link>
            </Card.Text>
        </Card.Body>
        </Card>
    );
}