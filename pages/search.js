import Form from 'react-bootstrap/Form';
import { Col, Row } from "react-bootstrap";
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useEffect } from 'react';
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch(){
    const router = useRouter();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            q: "",
            searchBy: "",
            geoLocation: "",
            medium: "",
            isOnView: "",
            isHighlight: ""

        }
    });
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    async function submitForm(data, e){
        e.preventDefault();
        var queryString = "";
        queryString = queryString + data.searchBy + "=true";

        if(data.geoLocation){
            queryString = queryString + "&geoLocation=" + data.geoLocation;
        
        }

        if(data.medium){
            queryString = queryString + "&medium=" + data.medium;
        
        }

        queryString = queryString + "&isOnView=" + data.isOnView + "&isHighlight=" + data.isHighlight + "&q=" + data.q;

        setSearchHistory(await addToHistory(queryString)) 
        router.push("/artwork?" + queryString);

    }

    return(
        <Form onSubmit={handleSubmit(submitForm)}>
            <Row>
                <Col>
                <Form.Group className="mb-3">
                    <Form.Label>Search Query</Form.Label>
                    <Form.Control type="text" placeholder="" name="q" required {...register('q')}/>
                </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                <Form.Label>Search By</Form.Label>
                <Form.Select name="searchBy" className="mb-3" {...register('searchBy')}>
                    <option value="title">Title</option>
                    <option value="tags">Tags</option>
                    <option value="artistOrCulture">Artist or Culture</option>
                </Form.Select>
                </Col>
                <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Geo Location</Form.Label>
                    <Form.Control type="text" placeholder="" name="geoLocation" {...register('geoLocation')}/>
                    <Form.Text className="text-muted">
                        Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
                    </Form.Text>
                </Form.Group>
                </Col>
                <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Medium</Form.Label>
                    <Form.Control type="text" placeholder="" name="medium" {...register('medium')}/>
                    <Form.Text className="text-muted">
                        Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
                    </Form.Text>
                </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                <Form.Check
                    type="checkbox"
                    label="Highlighted"
                    name="isHighlight"
                    {...register('isHighlight')}
                />
                <Form.Check
                    type="checkbox"
                    label="Currently on View"
                    name="isOnView"
                    {...register('isOnView')}
                />
                </Col>
            </Row>
            <Row>
                <Col>
                <br />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                </Col>
            </Row>
        </Form>
    );
}