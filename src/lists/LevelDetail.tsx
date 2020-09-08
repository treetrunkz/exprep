import React, { useEffect, useRef, useState } from "react";
import { Button, Descriptions, Layout, Popover, Spin } from "antd";
import LevelMap from "./components/LevelMap";
import { QueryData } from "../components/QueryData";
import SummaryMeasures from "./components/SummaryMeasures";
import HotList from "./components/HotList";
import PeriodTrends from "./components/PeriodTrends";
import { LeftOutlined } from '@ant-design/icons';
import LevelList from "./components/LevelList";
import MetricsTerms from "./MetricsTerms";
import { isObject } from 'util';
import { globalConfig } from 'antd/lib/modal/confirm';


const LevelDetail = () => {
    const query = useRef(new QueryData('hpccsystems_covid19_query_location_map'));
    const [location, setLocation] = useState<string>('');
    const locationStack = useRef<any>([]);

    const loadStack = useRef<any>([]);
    //Data
    const [summaryData, setSummaryData] = useState<any>([]);
    const [maxData, setMaxData] = useState<any>([]);
    const [listData, setListData] = useState<any>([]);
    const [itMapData, setItMapData] = useState<any>([]);
    const [mapData, setMapData] = useState<any>(new Map());
    const [periodTrendsColumnData, setPeriodTrendsColumnData] = useState<any>([]);
    const [periodTrendsGroupedData, setPeriodTrendsGroupedData] = useState<any>([]);
    const [hotListData, setHotListData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const scrollLayout = useRef<any | null>(null);


    useEffect(() => {

        function toMapData(data: any) {
            let mapData = new Map();

            if (data) {
                data.forEach((item: any) => {
                    let locations: string;
                    if (item.location_code) {
                        locations = item.location_code.split('-');
                    } else {
                        locations = item.location.split('-');
                    }


                    //console.log(locations[locations.length - 1] + ' length ' + locations[locations.length - 1].length);
                    mapData.set(locations[locations.length - 1], item);
                })
            }
            return mapData;
        }
        console.log(mapData)
        setLoading(true);

        setSummaryData([]);
        setMaxData([]);
        setMaxData(new Map());
        setPeriodTrendsColumnData([]);
        setPeriodTrendsGroupedData([]);
        setHotListData([]);
        //Get the data
        let filters = new Map();
        filters.set('level', locationStack.current.length + 1);
        if (locationStack.current.length >= 1)
            filters.set('level1_location', locationStack.current[0]);
        if (locationStack.current.length >= 2)
            filters.set('level2_location', locationStack.current[1]);
        if (locationStack.current.length >= 3)
            filters.set('level3_location', locationStack.current[2]);//NOTE: This is the max level supported. For US, it is the county level
        query.current.initData(filters).then(() => {
            let summary = query.current.getData('summary');
            if (summary.length > 0) {
                summary.forEach((item: any) => {
                    setSummaryData(item);
                });
            }
            let sum = query.current.getSetData('period_trend_column');

            console.log(sum);
            sum.forEach((item: any) => {
                console.log(item);
            })
            if (sum.length > 0) {
                summary.forEach((item: any) => {
                    setItMapData(item)
                    console.log(item);
                })
            }
            console.log(setItMapData);
            console.log(itMapData);
            console.log(summary)


            let max = query.current.getData('max');

            if (max.length > 0) {

                max.forEach((item: any) => {
                    setMaxData(item);
                });

            }
            //NEED TO CHANGE FROM CURRENT TO JUST THE PERIOD TREND
            //ASSIGN EVERY 1st and 9th unit to a new value with the key
            //of it's location
            //redfine.current to just getData
            //data.forEach(list)item.r >> data.forEach data2period_trend_colu,m data2.forEach(item:any) 

            let data = query.current.getData('list')
            let datamap = new Map();
            let data1 = query.current.getData('period_trend_column')
            let datamap1 = new Map();

            if (data) {
                data.forEach((item: any) => {
                    datamap.set(item.location, item.r)
                    //console.log(item.location)
                    data1.forEach((item: any) => {
                        datamap1.set(item, item)
                        let cur = item.location
                        query.current.getData('period_trend_grouped_column')
                        //console.log(item.r)
                    })
                })
            }


            function itemizedCaseData(data: any) {
                let itMapData = new Map();
                if (data) {
                    data.forEach((item: any) => {
                        let new_cases: number;


                        itMapData.set(item.location, item.r)

                        if (item.new_cases) {
                            new_cases = item.new_cases;
                        } else {
                            console.log('missing cases');
                        }
                        //console.log(locations[locations.length - 1] + ' length ' + locations[locations.length - 1].length);
                        //itMapData.set(item.r, item.Location);
                        //a item.r2, item.r3, item.r4, item.r5
                        //or item.c, item.c2, item.c3 
                        //period_trend_column of 
                        let vi = item.location
                        console.log(query.vi.getSetData())
                    })
                }
                //itMapData.forEach(handleColor([key, value]ccv))
                return itMapData;

            }

            console.log(itemizedCaseData(data));

            // function animatedFillData(itMapData: any) {
            //     let len = itMapData.length();
            //     itMapData.forEach();
            //     Array.prototype.forEach.call(itMapData, props.olAnimatedColorHandler)
            // }

            // animatedFillData(itMapData)
            // find how to type for the match: 
            //'(value: [string, unknown], index: number, array: [string, unknown][]): readonly [string | number | symbol, never]'.

            console.log(query.current.getData('list'));

            let list = query.current.getData('list');
            setListData(list);//The list only shown if there is no map

            let mapData = toMapData(list);
            let secData = itemizedCaseData(list);
            console.log(secData);
            setMapData(mapData);
            setItMapData(secData);
            console.log(query.current.getData('period_trend_column'));
            console.log(query.current.getData('grouped_trend_column'));
            console.log('period_trend_column')

            query.current.getData('period_trend_list')


            setPeriodTrendsColumnData(query.current.getData('period_trend_column'));
            setPeriodTrendsGroupedData(query.current.getData('period_trend_grouped'));
            //console.log('map data size - ' + mapData.size)

            setHotListData(query.current.getData('hot_list'));

            setLoading(false);

        })

    }, [location]);
    const pushLoad = (location: any) => {
        loadStack.current.push(location)
        setLocation(location)
        console.log(loadStack)
    }

    const pushLocation = (location: any) => {

        locationStack.current.push(location);
        setLocation(location);

        scrollLayout.current.scrollTo(0, 0);
    }

    const popLocation = () => {
        locationStack.current.pop();
        setLocation(locationStack.current[locationStack.current.length - 1]);

        scrollLayout.current.scrollTo(0, 0);
    }

    function stateHandler(name: string) {
        var states = [
            "ALABAMA",
            "ALASKA",
            "ARIZONA",
            "ARKANSAS",
            "CALIFORNIA",
            "COLORADO",
            "CONNECTICUT",
            "DELAWARE",
            "DISTRICT OF COLUMBIA",
            "FLORIDA",
            "GEORGIA",
            "HAWAII",
            "IDAHO",
            "ILLINOIS",
            "INDIANA",
            "IOWA",
            "KANSAS",
            "KENTUCKY",
            "LOUISIANA",
            "MAINE",
            "MONTANA",
            "NEBRASKA",
            "NEVADA",
            "NEW HAMPSHIRE",
            "NEW JERSEY",
            "NEW MEXICO",
            "NEW YORK",
            "NORTH CAROLINA",
            "NORTH DAKOTA",
            "OHIO",
            "OKLAHOMA",
            "OREGON",
            "MARYLAND",
            "MASSACHUSETTS",
            "MICHIGAN",
            "MINNESOTA",
            "MISSISSIPPI",
            "MISSOURI",
            "PENNSYLVANIA",
            "RHODE ISLAND",
            "SOUTH CAROLINA",
            "SOUTH DAKOTA",
            "TENNESSEE",
            "TEXAS",
            "UTAH",
            "VERMONT",
            "VIRGINA",
            "WASHINGTON",
            "WEST VIRGINIA",
            "WISCONSIN",
            "WYOMING",
        ]
        if (states.includes(name)) {
            console.log('yes it matches')
        }
    }
    function olLoadHandler(name: string) {
        pushLoad(name)
    }
    function olSelectHandler(name: string) {
        console.log('location selection ' + name);
        stateHandler(name);
        pushLocation(name);
    }
    function locationUUID() {
        let uuid: string = 'THE WORLD';
        if (locationStack.current.length >= 1) {
            uuid += '-' + locationStack.current[0];
        }
        if (locationStack.current.length >= 2) {
            uuid += '-' + locationStack.current[1];
        }
        if (locationStack.current.length >= 3) {
            uuid += '-' + locationStack.current[2];
        }
        return uuid;
    }

    return (
        <Layout>
            <div style={{ textAlign: "center" }}>
                <Button href={"#commentary"} type={"link"} className={"anchor-btn"}>Commentary/Top</Button>
                <Button href={"#map"} type={"link"} className={"anchor-btn"}>Map</Button>
                <Button href={"#list"} type={"link"} className={"anchor-btn"}>List</Button>
                <Button href={"#summary_stats"} type={"link"} className={"anchor-btn"}>Stats</Button>
                <Button href={"#trends"} type={"link"} className={"anchor-btn"}>Trends</Button>
                <Button href={"#hot_spots"} type={"link"} className={"anchor-btn"}>Hot Spots</Button>
                <Popover key={'popover_metrics_terms'} title={"Metrics Terms"} content={<MetricsTerms />}
                    trigger={"click"} ><Button type={"link"} className={"anchor-btn"}>METRICS TERMS</Button></Popover>
                <Button onClick={() => popLocation()} style={{ height: 25 }} icon={<LeftOutlined />}
                    shape={"round"} type={"primary"} className={"anchor-btn"}
                    disabled={locationStack.current.length === 0}>{"BACK"}</Button>
            </div>
            <div style={{ overflow: 'auto', paddingLeft: 10, paddingRight: 10 }} ref={(e) => (scrollLayout.current = e)}>
                <Spin spinning={loading} delay={500}>


                    <div id={"commentary"} style={{ fontSize: 16, fontWeight: 'bold' }}>{locationUUID()}</div>

                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item>{summaryData.commentary}</Descriptions.Item>
                    </Descriptions>


                    <Layout.Content>
                        <div id={"map"} />
                        <LevelMap itMapData={itMapData} listData={mapData} maxData={maxData} locationAlias={''}
                            loadHandler={(name) => olLoadHandler(name)}
                            selectHandler={(name) => olSelectHandler(name)} location={locationUUID()} />
                        <div id={"list"} style={{ height: 5 }} />
                        <LevelList data={listData} location={locationUUID()}
                            selectHandler={(name) => olSelectHandler(name)} />
                        <div id={"summary_stats"} style={{ height: 10 }} />
                        <SummaryMeasures summaryData={summaryData} />

                        <div id={"trends"} style={{ height: 10 }} />
                        <PeriodTrends columnData={periodTrendsColumnData} groupedData={periodTrendsGroupedData} />
                        <div id={"hot_spots"} style={{ height: 10 }} />
                        <HotList data={hotListData} selectHandler={(name) => olSelectHandler(name)} />
                    </Layout.Content>


                </Spin>
            </div>
        </Layout>

    );


}

export default LevelDetail;

