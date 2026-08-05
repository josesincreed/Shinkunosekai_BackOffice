"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/components/ui/form";
import { userRoleLabels, userRoles } from "@/lib/constants/user-roles";
import {
  userCreateFormSchema,
  userUpdateFormSchema,
  type UserCreateFormValues,
  type UserUpdateFormValues,
} from "@/lib/validations/users/user.schema";
import type { UserActionResult, UserRow } from "@/types/user.types";

type CreateFormProps = {
  mode: "create";
  initialValues?: Partial<UserCreateFormValues>;
  onSubmit: (values: UserCreateFormValues) => Promise<UserActionResult>;
  onCancel: () => void;
};

type EditFormProps = {
  mode: "edit";
  user: UserRow;
  initialValues?: Partial<UserUpdateFormValues>;
  onSubmit: (values: UserUpdateFormValues) => Promise<UserActionResult>;
  onCancel: () => void;
};

type UserFormProps = CreateFormProps | EditFormProps;

function CreateUserForm({ initialValues, onSubmit, onCancel }: CreateFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateFormSchema) as Resolver<UserCreateFormValues>,
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      email: initialValues?.email ?? "",
      password: initialValues?.password ?? "",
      role: initialValues?.role ?? "USER",
      active: initialValues?.active ?? true,
      avatarUrl: initialValues?.avatarUrl ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const active = watch("active");

  const submit = async (values: UserCreateFormValues) => {
    setServerError(null);
    const result = await onSubmit(values);

    if (!result.ok) {
      setServerError(result.error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName">Nombre</Label>
            <Input id="fullName" autoComplete="off" {...register("fullName")} />
            {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" autoComplete="off" {...register("email")} />
            {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
            {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select id="role" {...register("role")}>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {userRoleLabels[role]}
                </option>
              ))}
            </Select>
            {errors.role ? <p className="text-xs text-red-600">{errors.role.message}</p> : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Activo</Label>
              <Switch checked={active} onCheckedChange={(checked) => setValue("active", checked, { shouldDirty: true })} />
            </div>
            <p className="text-xs text-slate-500">El usuario podrá iniciar sesión si tiene acceso al back office.</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" placeholder="https://..." autoComplete="off" {...register("avatarUrl")} />
            {errors.avatarUrl ? <p className="text-xs text-red-600">{errors.avatarUrl.message}</p> : null}
          </div>
        </div>

        <Separator />

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function EditUserForm({ user, initialValues, onSubmit, onCancel }: EditFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateFormSchema) as Resolver<UserUpdateFormValues>,
    defaultValues: {
      fullName: initialValues?.fullName ?? user.full_name ?? "",
      role: initialValues?.role ?? user.role,
      active: initialValues?.active ?? user.active,
      avatarUrl: initialValues?.avatarUrl ?? user.avatar_url ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const active = watch("active");

  const submit = async (values: UserUpdateFormValues) => {
    setServerError(null);
    const result = await onSubmit(values);

    if (!result.ok) {
      setServerError(result.error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-900">Correo</p>
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {user.email}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName">Nombre</Label>
            <Input id="fullName" autoComplete="off" {...register("fullName")} />
            {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select id="role" {...register("role")}>
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {userRoleLabels[role]}
                </option>
              ))}
            </Select>
            {errors.role ? <p className="text-xs text-red-600">{errors.role.message}</p> : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Activo</Label>
              <Switch checked={active} onCheckedChange={(checked) => setValue("active", checked, { shouldDirty: true })} />
            </div>
            <p className="text-xs text-slate-500">Solo un administrador activo puede permanecer en el sistema.</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" placeholder="https://..." autoComplete="off" {...register("avatarUrl")} />
            {errors.avatarUrl ? <p className="text-xs text-red-600">{errors.avatarUrl.message}</p> : null}
          </div>
        </div>

        <Separator />

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function UserForm(props: UserFormProps) {
  return props.mode === "create" ? (
    <CreateUserForm
      mode="create"
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
    />
  ) : (
    <EditUserForm
      mode="edit"
      user={props.user}
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
    />
  );
}
