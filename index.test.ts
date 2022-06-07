import {storeReading, memoryForRecords, resetMemory, findRecord} from './index'
// const storeReading = require('./index');

test('Readings have to be stored in order of value and created_at', () => {
	let testData = [{
		value: 75,
		created_at: new Date(2022, 6, 6),
		patient_id: 1,
	}, {
		value: 75,
		created_at: new Date(2022, 6, 5),
		patient_id: 1,
	}, {
		value: 74,
		created_at: new Date(2022, 6, 5),
		patient_id: 2,
	}, {
		value: 74,
		created_at: new Date(2022, 6, 6),
		patient_id: 2,
	}]
	let expected = [
		{
			value: 74,
			created_at: new Date(2022, 6, 5),
			patient_id: 2,
		}, {
			value: 74,
			created_at: new Date(2022, 6, 6),
			patient_id: 2,
		}, {
			value: 75,
			created_at: new Date(2022, 6, 5),
			patient_id: 1,
		}, {
			value: 75,
			created_at: new Date(2022, 6, 6),
			patient_id: 1,
		}
	]
	for (let i =0; i < testData.length; i ++) {
		storeReading(testData[i])
	}
	expect(memoryForRecords).toStrictEqual(expected);
});

test('Duplicate readings (same created_at) have to be discarded', () => {
	resetMemory();
	let testData = [{
		value: 75,
		created_at: new Date(2022, 5, 5),
		patient_id: 1
	}, {
		value: 85,
		created_at: new Date(2022, 5, 5),
		patient_id: 1
	}]

	let expected = [{
		value: 75,
		created_at: new Date(2022, 5, 5),
		patient_id: 1
	}]

	for (let i =0; i < testData.length; i ++) {
		storeReading(testData[i])
	}
	expect(memoryForRecords).toStrictEqual(expected);
});

test('Add flags records that are higher than +10% of average readings for the past month', () => {
	resetMemory();
	let testData = []
	for (let i = 0; i < 30; i ++) {
		testData.push({
			value: 75,
			created_at: new Date(2022, 4, i),
			patient_id: 1
		})
	}
	testData.push({
		value: 85,
		created_at: new Date(2022, 5, 5),
		patient_id: 1
	})

	for (let i =0; i < testData.length; i ++) {
		storeReading(testData[i])
	}
	let result = findRecord({
		created_at: new Date(2022, 5, 5),
		patient_id: 1
	})
	expect(result.needTherapist).toBe(true);
});