import conmap from './conmap.jpg'
import './pages.css';
import Map2 from './Map2';

//Maybe using an interactive map with zoom in and zoom out features would be more user accessible

export default function Map() {
    return (
        <>
            <h1>Map</h1>
            <h1tml>
            <header>
                <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=0.5,user-scalable=yes,initial-scale=1.0" />
            </header>
            <body>
                <img class="image" img src={conmap} className="App-map" alt="Img-map" />
            </body>   
            </h1tml>   
            <Map2/>    
        </>
        
    )
}