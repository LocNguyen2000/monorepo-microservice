import { FunctionComponent,  useEffect, useState } from "react"
import { getGlobalContext } from "../lib/context"
import { Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import FooterComponent from "../layout/Footer"
import HeaderComponent from "../layout/Header"
import LocationCarousel from "./location/LocationCarosel"
import LocationList from "./location/LocationListing"
import '../layout/layout.css'
import { useSyncAuthUser } from "../lib/hooks"

const HomePage: FunctionComponent<{}> = () => {
    const {authUser, setAuthUser} = getGlobalContext()
    const [locations, setLocations] = useState([]);
    const { serviceClient } = getGlobalContext()

    useSyncAuthUser()

    useEffect(() => {
      serviceClient.get("location").then((response) => {
          const {total, data} = response.data
          
        setLocations(data);
      });
    }, []);

    return (
        <Layout className="layout-container">
            <HeaderComponent />
            <Content className="content-container">
                <LocationCarousel locations={locations} />
                <LocationList locations={locations} />
            </Content>
            <FooterComponent />
        </Layout>
    )
}

export default HomePage