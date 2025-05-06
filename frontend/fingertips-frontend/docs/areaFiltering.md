# Area filtering

| element             | input      | name | apiClient (areasApi) | api params                                                 |
|---------------------|------------|------|----------------------|------------------------------------------------------------|
| Select an area type | Select     | ats  | getAreaTypes         | none                                                       |
| Select a group type | Select     | gts  | *none*†              | none                                                       |
| Select a group      | Select     | gs   | getAreaTypeMembers   | areaType                                                   |
| Area checkboxes     | Checkboxes | as   | getArea              | areaCode (gs)<br />includeChildren:true<br />childAreaType |

† Group type choices are derived from the areaTypes and the selected areaType
