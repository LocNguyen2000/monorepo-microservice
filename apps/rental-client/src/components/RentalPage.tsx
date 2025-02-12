import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../lib/context"
import { ScreenRoutes } from "../lib/constant"

const RentalPage: FunctionComponent<{}> = () => {
    const {authUser, setAuthUser} = useContext(GlobalContext)
    const navigate = useNavigate()

    return (
        <>Hello</>
    )
}

export default RentalPage