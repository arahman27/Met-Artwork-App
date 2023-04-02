import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useSWR from 'swr';
import Error from 'next/error';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { useState} from 'react';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';
import { useEffect } from 'react';

export default function ArtworkCardDetail(prop) {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data: result, error } = useSWR(
        prop ?
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + prop.objectID : null,
        fetcher

    );

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
 
    const [showAdded, setShowAdded] = useState(false);

    if(error){
        return <Error statusCode={404}/>

    }

    if(!result){
        return null;
    
    }

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])

    async function favouritesClicked(e){
        if(showAdded){
            setFavouritesList(await removeFromFavourites(prop));
            setShowAdded(false);

        }
        else{
            setFavouritesList(await addToFavourites(prop));
            setShowAdded(true);

        }
    }


    const redirectRef = "/artwork/" + result.objectID;

    return (
        <Card style={{ width: '18rem' }}>
            {result.primaryImage? <Card.Img variant="top" src={result.primaryImage}/> : <></>}
            <Card.Body>
                <Card.Title>{result.title? result.title : "N/A"}</Card.Title>
                <Card.Text>
                    {result.objectDate? result.objectDate : "N/A "}
                    {result.classification? result.classification : "N/A "}
                    {result.medium? result.medium : "N/A "}
                    <br/>
                    <br/>
                    {result.artistDisplayName? result.artistDisplayName && <a href={result.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> : "N/A "}
                    {result.creditLine? result.creditLine : "N/A "}
                    {result.dimension? result.dimension : "N/A "}
                    <Button variant={showAdded ? "primary" : "outline-primary"} onClick={(e) => favouritesClicked(e)}>{showAdded ? "+Favourite(added)" : "+Favourite"}</Button>&nbsp;
                    <Link href={redirectRef} passHref><Button variant="primary">{result.objectID}</Button></Link>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}