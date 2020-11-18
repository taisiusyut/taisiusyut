// eslint-disable-next-line
function append(form: FormData, key: string, data: any) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      append(form, `${key}[]`, '');
    } else {
      data.forEach((v, index) => {
        append(form, `${key}[${index}]`, v);
      });
    }
  } else if (
    typeof data === 'object' &&
    data instanceof File === false &&
    data !== null
  ) {
    for (const sub in data) {
      form.append(`${key}[${sub}]`, data[sub]);
    }
  } else {
    form.append(key, data);
  }
}

export function createFormData<T extends Record<string, unknown>>(params: T) {
  const form = new FormData();
  Object.entries(params).forEach(([key, data]) => {
    append(form, key, data);
  });
  return form;
}
