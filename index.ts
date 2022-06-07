export interface RecordData {	
	value: number,
	created_at: Date,
	patient_id: number,
	needTherapist?: Boolean
}

export interface RecordQuery {
	patient_id: number,
	created_at: Date
}

export var memoryForRecords: RecordData[] = []

export function storeReading(data: RecordData) {
	if (!isValid(data))
		return
	if (isHigh(data)) {
		data.needTherapist = true
	}
	memoryForRecords.push(data)
	memoryForRecords.sort(compare)
}

function isValid(data: RecordData) {
	return memoryForRecords.filter(
				record => record.created_at.valueOf() == data.created_at.valueOf()
							&&  record.patient_id === data.patient_id
			).length === 0
}
function compare(p1:RecordData, p2: RecordData) {
	if (p1.value !== p2.value) {
		return p1.value - p2.value
	} else {
		return p1.created_at > p2.created_at ? 1: -1
	}
}

function isHigh(data: RecordData) {
	let lastMonth = data.created_at.getMonth( ) - 1
	let year = data.created_at.getFullYear()
	let firstOfLastMonth = new Date( year, lastMonth, 1).valueOf()
	let endOfLastMonth = new Date( year, lastMonth + 1, 0).valueOf()

	let lastMonthRecord = memoryForRecords
		.filter(record => record.patient_id === data.patient_id)
		.filter(
			record => record.created_at.valueOf() >= firstOfLastMonth
			&& record.created_at.valueOf() <= endOfLastMonth
		)
	let avg: number = lastMonthRecord.reduce((a, b) => a + b.value, 0 ) / lastMonthRecord.length
	return data.value > avg * 1.1
}

export function findRecord(query: RecordQuery) {
	let record = memoryForRecords.filter(
		record => record.created_at.valueOf() === query.created_at.valueOf()
					&&  record.patient_id === query.patient_id
	)[0]
	return record
}

export function resetMemory() {
	memoryForRecords = []
}