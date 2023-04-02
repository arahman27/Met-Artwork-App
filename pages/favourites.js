import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { Col, Row } from "react-bootstrap";
import ArtworkCard from '@/components/ArtworkCard';

export default function Favourites(){

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    if(!favouritesList){
        return null;
    
    }

    return(
        <>
            {favouritesList.length > 0 ?
                <Row className="gy-4">
                    {favouritesList.map((fav, i) => (
                        <Col lg={3} key={i}><ArtworkCard objectID={fav.objectID}/></Col>

                    ))}
                </Row> : <><br/><br/><h4>Nothing Here try adding some new artwork to the list.</h4></>
            } 
        </>
    );
}