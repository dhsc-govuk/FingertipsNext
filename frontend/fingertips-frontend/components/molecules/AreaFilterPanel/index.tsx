
import { AreaDocument } from "@/lib/search/searchTypes"
import { Checkbox, Link , ListItem, UnorderedList} from "govuk-react"
import styled from "styled-components"


export interface SelectableAreaDocument extends AreaDocument{
    checked: boolean
}

const StyleAreaFilterPanelItemsPanel = styled(UnorderedList)({

})

const StyleAreaFilterPanelItem = styled(ListItem)({

})


interface AreaFilterPanelProps{
   areas : SelectableAreaDocument[]
}

export const AreaFilterPanel =({areas}:AreaFilterPanelProps)=>{
    
    return (
           <div>
              <Link href="#" data-testid="search-form-link-filter-area"  onClick={
                (e)=>{
                    e.preventDefault();

                }
              }>
                 Open a filter to add or change areas
              </Link>
              
              {areas.length > 0 && (
                <StyleAreaFilterPanelItemsPanel>
                    {
                        areas.map((area)=>(
                            <StyleAreaFilterPanelItem key='filter-{{area.areaCode}}' >
                            <Checkbox checked></Checkbox>
                               <div>
                                    {area.areaName}
                               </div>
                               <div>
                                   {area.areaType}
                               </div>
                            </StyleAreaFilterPanelItem>
                        ))
                    }
                </StyleAreaFilterPanelItemsPanel>
             )}
           </div>
    )
}