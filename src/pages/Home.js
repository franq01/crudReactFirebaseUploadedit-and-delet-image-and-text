import React,{useState, useEffect} from 'react'
import{ db} from'../firebase/firebase'
import{Button, Card, Container, Grid, Image, Item} from 'semantic-ui-react'
import {useNavigate} from 'react-router-dom'
import {collection, doc, onSnapshot, snapshotEqual} from 'firebase/firestore'

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, "users"), (snapshot) =>{
            let list = [   ];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
            });
            setUsers(list);
            setLoading(false);

        },
        (error)=>{
            console.error(error);
        }
        );
        return ()=>{
            unsub();
        };
    },[]);
  return (
    <Container>
        <Card.Group>
            <Grid stackable>
                {users && users.map((item)=>(
                    <Grid.Column>
                        <Card key={item.id}>
                            <Card.Content>
                                <Image
                                src={item.img}
                                size='medium'
                                style={{
                                    height:"150px",
                                    width:"150px",
                                    borderRadious:"50%",
                                }}
                                />
                                <Card.Header style={{marginTop: "10px"}}>
                                    {item.name}
                                </Card.Header>
                                <Card.Description >{item.info}</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <div>
                                    <button color='green' onClick={()=> navigate(`/update/${item.id}`)}>
                                        update
                                    </button>
                                    <button color='purple' >
                                        view
                                    </button>
                                </div>

                            </Card.Content>
                        </Card>
                    </Grid.Column>
                ))}
            </Grid>
        </Card.Group>
    </Container>
  )
}

export default Home