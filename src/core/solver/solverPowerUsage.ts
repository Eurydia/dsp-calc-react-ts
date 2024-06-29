import { getSorter } from "~assets/get";
import { tryParseIntClamp } from "~core/parsing";
import {
	ConfigFormData,
	EditorFormData,
	PowerUsageData,
} from "~types/query";

export const computeIdleUsageMWPerFacility = (
	data: ConfigFormData,
) => {
	const { sorter, facility: f } = data;
	let usageMW = 0;
	for (const k in sorter) {
		const s = getSorter(k);
		if (s === undefined) {
			continue;
		}
		const parsedCount = tryParseIntClamp(
			sorter[k],
			0,
			Number.MAX_SAFE_INTEGER,
		);
		usageMW += parsedCount * s.idleConsumptionMW;
	}
	return f.idleConsumptionMW + usageMW;
};

export const computeWorkUsageMWPerFacility = (
	data: ConfigFormData,
) => {
	const {
		facility: f,
		proliferator: p,
		sorter,
	} = data;
	let usageMW = 0;
	for (const k in sorter) {
		const s = getSorter(k);
		if (s === undefined) {
			continue;
		}
		const parsedCount = tryParseIntClamp(
			sorter[k],
			0,
			Number.MAX_SAFE_INTEGER,
		);
		usageMW += parsedCount * s.workConsumptionMW;
	}
	const facilityWorkConsumptionMW =
		f.workConsumptionMW *
		p.workConsumptionMultiplier;

	return facilityWorkConsumptionMW + usageMW;
};

export const computePowerUsage = (
	data: EditorFormData,
): PowerUsageData => {
	const idleUsageMWPerFacility =
		computeIdleUsageMWPerFacility(data);
	const workUsageMWPerFacility =
		computeWorkUsageMWPerFacility(data);
	return {
		idleUsageMWPerFacility,
		workUsageMWPerFacility,
	};
};
