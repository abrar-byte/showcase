export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const handleImageError = (event: any) => {
  event.target.src = '/images/placeholder-car.png';
};

export const calculateFinalAmount = (
  discount: number = 0,
  amount: number = 0,
) => {
  const discountAmount = parseFloat(((amount * discount) / 100).toFixed(2));
  const finalAmount = parseFloat((amount - discountAmount).toFixed(2));
  return { finalAmount, discountAmount };
};

export const customMappingFunction: MappingFunction = (item: any) => ({
  label: item.name,
  value: item.id,
});

export type MappingFunction = (item: any) => { label: string; value: any };

export function createOptions(arr: any, mapFunction?: MappingFunction) {
  const defaultMapping: MappingFunction = (item) => ({
    label: item.name,
    value: item.id,
  });

  if (!mapFunction) {
    mapFunction = defaultMapping;
  }

  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object') {
    return arr.map(mapFunction);
  } else if (Array.isArray(arr)) {
    return arr.map((item) => ({ label: item, value: item }));
  } else {
    throw new Error('Input harus berupa array');
  }
}

export const parseOptions = (arr: string[]) =>
  arr?.map((x) => ({ label: x, value: x }));
