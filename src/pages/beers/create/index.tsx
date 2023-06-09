import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createBeer } from 'apiSdk/beers';
import { Error } from 'components/error';
import { beerValidationSchema } from 'validationSchema/beers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { AccountInterface } from 'interfaces/account';
import { getAccounts } from 'apiSdk/accounts';
import { BeerInterface } from 'interfaces/beer';

function BeerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BeerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBeer(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BeerInterface>({
    initialValues: {
      name: '',
      hero_image: '',
      beer_type: '',
      brewery_location: '',
      brewery_history: '',
      description: '',
      interesting_facts: '',
      purchase_locations: '',
      status: '',
      account_id: (router.query.account_id as string) ?? null,
    },
    validationSchema: beerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Beer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="hero_image" mb="4" isInvalid={!!formik.errors?.hero_image}>
            <FormLabel>Hero Image</FormLabel>
            <Input type="text" name="hero_image" value={formik.values?.hero_image} onChange={formik.handleChange} />
            {formik.errors.hero_image && <FormErrorMessage>{formik.errors?.hero_image}</FormErrorMessage>}
          </FormControl>
          <FormControl id="beer_type" mb="4" isInvalid={!!formik.errors?.beer_type}>
            <FormLabel>Beer Type</FormLabel>
            <Input type="text" name="beer_type" value={formik.values?.beer_type} onChange={formik.handleChange} />
            {formik.errors.beer_type && <FormErrorMessage>{formik.errors?.beer_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="brewery_location" mb="4" isInvalid={!!formik.errors?.brewery_location}>
            <FormLabel>Brewery Location</FormLabel>
            <Input
              type="text"
              name="brewery_location"
              value={formik.values?.brewery_location}
              onChange={formik.handleChange}
            />
            {formik.errors.brewery_location && <FormErrorMessage>{formik.errors?.brewery_location}</FormErrorMessage>}
          </FormControl>
          <FormControl id="brewery_history" mb="4" isInvalid={!!formik.errors?.brewery_history}>
            <FormLabel>Brewery History</FormLabel>
            <Input
              type="text"
              name="brewery_history"
              value={formik.values?.brewery_history}
              onChange={formik.handleChange}
            />
            {formik.errors.brewery_history && <FormErrorMessage>{formik.errors?.brewery_history}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="interesting_facts" mb="4" isInvalid={!!formik.errors?.interesting_facts}>
            <FormLabel>Interesting Facts</FormLabel>
            <Input
              type="text"
              name="interesting_facts"
              value={formik.values?.interesting_facts}
              onChange={formik.handleChange}
            />
            {formik.errors.interesting_facts && <FormErrorMessage>{formik.errors?.interesting_facts}</FormErrorMessage>}
          </FormControl>
          <FormControl id="purchase_locations" mb="4" isInvalid={!!formik.errors?.purchase_locations}>
            <FormLabel>Purchase Locations</FormLabel>
            <Input
              type="text"
              name="purchase_locations"
              value={formik.values?.purchase_locations}
              onChange={formik.handleChange}
            />
            {formik.errors.purchase_locations && (
              <FormErrorMessage>{formik.errors?.purchase_locations}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<AccountInterface>
            formik={formik}
            name={'account_id'}
            label={'Select Account'}
            placeholder={'Select Account'}
            fetcher={getAccounts}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'beer',
  operation: AccessOperationEnum.CREATE,
})(BeerCreatePage);
