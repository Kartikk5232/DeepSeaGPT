from argopy import DataFetcher
import json

def fetch_and_save():
    ds = (
        DataFetcher(
            src="gdac",
            parallel=True,
            cache=True
        )
        .region([68, 75, 14, 21, 0, 100])
        .to_xarray()
    )

    records = []
    n = min(10, len(ds["LATITUDE"].values))

    for i in range(n):
        records.append({
            "latitude": float(ds["LATITUDE"].values[i]),
            "longitude": float(ds["LONGITUDE"].values[i]),
            "temperature": float(ds["TEMP"].values[i]),
            "salinity": float(ds["PSAL"].values[i]),
            "pressure": float(ds["PRES"].values[i]),
        })

    with open("argo_cache.json", "w") as f:
        json.dump(records, f, indent=2)

fetch_and_save()