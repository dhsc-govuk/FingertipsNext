import {Table} from "govuk-react";
import {WeatherForecast} from "@/generated-sources/api-client";

interface tableProps {
data: WeatherForecast[];
}

export function PlainTable({data}:Readonly<tableProps>) {
    return <Table
        head={
            <Table.Row>
                <Table.CellHeader date>Date</Table.CellHeader>
                <Table.CellHeader numeric>Temperature C</Table.CellHeader>
                <Table.CellHeader numeric>Temperature F</Table.CellHeader>
                <Table.CellHeader>Summary</Table.CellHeader>
            </Table.Row>
        }>
        {data.map((item) => (
            <Table.Row key={`${item.date}-${item.temperatureC}`}>
                <Table.Cell>{item.date?.toLocaleDateString('en-GB') ?? ''}</Table.Cell>
                <Table.Cell numeric>{item.temperatureC}</Table.Cell>
                <Table.Cell numeric>{item.temperatureF}</Table.Cell>
                <Table.Cell>{item.summary}</Table.Cell>
            </Table.Row>
        ))}
    </Table>
}
