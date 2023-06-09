import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getBeers, deleteBeerById } from 'apiSdk/beers';
import { BeerInterface } from 'interfaces/beer';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function BeerListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<BeerInterface[]>(
    () => '/beers',
    () =>
      getBeers({
        relations: ['account'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteBeerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('beer', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/beers/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('beer', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Beer
            </Text>
            <Link href={`/beers/create`}>
              <Button colorScheme="blue" mr="4">
                Create
              </Button>
            </Link>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>hero_image</Th>
                  <Th>beer_type</Th>
                  <Th>brewery_location</Th>
                  <Th>brewery_history</Th>
                  <Th>description</Th>
                  <Th>interesting_facts</Th>
                  <Th>purchase_locations</Th>
                  <Th>status</Th>
                  {hasAccess('account', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>account</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.hero_image}</Td>
                    <Td>{record.beer_type}</Td>
                    <Td>{record.brewery_location}</Td>
                    <Td>{record.brewery_history}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.interesting_facts}</Td>
                    <Td>{record.purchase_locations}</Td>
                    <Td>{record.status}</Td>
                    {hasAccess('account', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/accounts/view/${record.account?.id}`}>
                          {record.account?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('beer', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/beers/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('beer', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'beer',
  operation: AccessOperationEnum.READ,
})(BeerListPage);
