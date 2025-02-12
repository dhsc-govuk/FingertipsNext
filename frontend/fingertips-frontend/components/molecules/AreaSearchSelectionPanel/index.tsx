import { AreaDocument } from "@/lib/search/searchTypes"
import styled from "styled-components"
import { UnorderedList, ListItem } from "govuk-react"
import { StyleSearchHeader } from "../AreaSearchInputField"


const StyleAreaSearchSelectionPanel = styled(UnorderedList)({
    padding:"0px",
    margin:"0px",
})


const StyleAreaSearchSelectionPanelItem = styled(ListItem)({
    display:"flex",
    padding:"5px",
    margin:"0px",
    border:"2px solid #000",
    overflow:"clip",
    flexDirection:"row"
})

interface AreaSearchSelectionPanelProps {
   areas : AreaDocument[]
}
export const AreaSearchSelectionPanel = ({areas}:AreaSearchSelectionPanelProps)=>{
  return(
    <div>
        <StyleSearchHeader>Selected areas({areas.length})</StyleSearchHeader>
        
        <StyleAreaSearchSelectionPanel> {areas.map((area : AreaDocument)=>(
                <StyleAreaSearchSelectionPanelItem key={area.areaCode}>
                    <div> X </div>
                    <div>{area.areaCode}-{area.areaName}</div>
                    <div>{area.areaType}</div>
                </StyleAreaSearchSelectionPanelItem>
            ))}
        </StyleAreaSearchSelectionPanel>
     </div>
  )
}