import _countries from "world-countries";

const countries = _countries.map(({ cca2, name, flag, latlng, region }) => ({
  value: cca2,
  label: name.common,
  flag,
  latlng,
  region,
}));

const useCountries = () => {
  const getAll = () => countries;
  const getByValue = (value: string) =>
    countries.find((country) => country.value === value);
  return { getAll, getByValue };
};

export default useCountries;
