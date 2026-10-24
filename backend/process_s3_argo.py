import xarray as xr
import json
import glob
import math


# 🌊 Search all downloaded Argo NetCDF files recursively
all_files = glob.glob("data/coriolis/**/*.nc", recursive=True)

# ✅ Keep ONLY real profile files
files = [f for f in all_files if f.lower().endswith("_prof.nc")]

print("Total profile files:", len(files))

records = []


# ✅ Works for scalar + multidimensional values
def safe_value(v):
    values = v.values

    # scalar value
    if hasattr(values, "shape") and values.shape == ():
        return float(values)

    # multidimensional array → take first value
    return float(values.flat[0])


# 🚀 Process max 100 profiles (best for chatbot + charts)
for file in files:
    try:
        ds = xr.open_dataset(file, decode_timedelta=False)

        # skip corrupted files
        if "LATITUDE" not in ds or "LONGITUDE" not in ds:
            continue

        record = {
            "latitude": safe_value(ds["LATITUDE"]),
            "longitude": safe_value(ds["LONGITUDE"]),
            "source": "AWS S3 Official Argo Profile"
        }

        # 🌡️ temperature
        if "TEMP" in ds:
            temp = safe_value(ds["TEMP"])
            if not math.isnan(temp):
                record["temperature"] = temp

        # 🌊 salinity
        if "PSAL" in ds:
            sal = safe_value(ds["PSAL"])
            if not math.isnan(sal):
                record["salinity"] = sal

        # 📉 pressure
        if "PRES" in ds:
            pres = safe_value(ds["PRES"])
            if not math.isnan(pres):
                record["pressure"] = pres

        records.append(record)

    except Exception as e:
        print(f"Skipping file {file}: {e}")


# 💾 Save final chatbot-ready JSON
with open("argo_cache.json", "w") as f:
    json.dump(records, f, indent=2)

print(f"✅ Created {len(records)} real Argo profile records")